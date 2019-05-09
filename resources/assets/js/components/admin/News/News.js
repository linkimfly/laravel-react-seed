import React, { Component } from 'react';
import { Table, Button, Modal, Form, Input, message, Select, Upload, Icon } from 'antd';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
const ButtonGroup = Button.Group;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;

export default class News extends React.Component {
  constructor(props) {
    super();
    this.state = {
			news: [],
			currentNews: null,
			types: [],
			loading: true,
			visibleNewsEditModal: false,
    };
  }
	componentWillMount(){
		this.fetchData();
	}
  render(){
		const columns = [{
		  title: '标题',
		  dataIndex: 'title',
		  key: 'title',
		}, {
		  title: '栏目',
		  dataIndex: 'type.name',
		  key: 'type',
		}, {
		  title: '作者',
		  dataIndex: 'author',
		  key: 'author',
		}, {
		  title: '创建时间',
		  dataIndex: 'created_at',
		  key: 'created_at',
		}, {
      title: '操作',
      key: 'action',
      width: 180,
      render: (text, record) => (
        <span>
          <ButtonGroup>
							<Button onClick={e => {this.showNewsEditModal(e, '编辑新闻', record.id)}}>编辑</Button>
              <Button onClick={e => {this.handleDelete(e, record.id)}}>删除</Button>
          </ButtonGroup>
        </span>
      ),
    }];
    return (
      <div style={{ padding:20 }}>
				<Button type="primary" onClick={e => {this.showNewsEditModal(e, '发布新闻')}}>发布新闻</Button>
      	<Table dataSource={this.state.news} columns={columns} loading={this.state.loading} />

				<NewsEditForm
					wrappedComponentRef={inst => this.formRef = inst}
					visible={this.state.visibleNewsEditModal}
					onCancel={this.handleCancel}
					onSubmit={this.handleSubmit}
					title={this.state.newsEditModalTitle}
					types={this.state.types}
				/>
      </div>
    )
  }

	fetchData = () => {
		if (this.state.loading != true) {
			this.setState({loading: true});
		}
		axios.get(`${prefixAPI}/news`)
		.then(response => {
			let news = response.data.news;
			let types = response.data.types;
			news.map(currentNews => {
				currentNews.key = currentNews.id;
			})
			this.setState({
				news: news,
				types: types,
				loading: false,
			})
		})
		.catch(err => {
			console.log(err);
		})
	}

	showNewsEditModal = (e, title=null, id=null) => {
		this.setState({ newsEditModalTitle: title });
		if (id) {
			axios.get(`${prefixAPI}/news/${id}`)
			.then(res => {
				let currentNews = res.data.current_news;
				console.log(currentNews);
				this.formRef.props.form.setFieldsValue({
					title: currentNews.title,
					type: currentNews.type,
					author: currentNews.author,
					content_raw: BraftEditor.createEditorState(currentNews.content_html),//TODO 目前只能通过传入 html 格式的数据初始化，更好的办法是使用 raw 格式的数据
					attachments: JSON.parse(currentNews.attachments),
				});
				this.setState({
					currentNews: currentNews,
					visibleNewsEditModal: true
				});
			})
			.catch(err => {
				console.log(err);
			})
		}else {
			this.setState({ visibleNewsEditModal: true });
		}

  }

  handleSubmit = (e) => {
		let form = this.formRef.props.form;
		form.validateFields((err, values) => {
      if (!err) {
				if (this.state.currentNews) {
					values.id = this.state.currentNews.id;
				}
				if (values.content_raw) {
					values.content_html = values.content_raw.toHTML();
					values.content_raw = values.content_raw.toRAW();
				}
				if (values.attachments) {
					values.attachments = values.attachments.map(attachment => {
						console.log(attachment);
						if (attachment.response) {
							return {
								uid: attachment.uid,
								name: attachment.name,
								status: attachment.status,
								url: attachment.response.url,
							}
						}else {
							return attachment;
						}
					})
				}
				axios.post(`${prefixAPI}/news`, values)
				.then(response => {
					if (response.data.status == 0) {
						message.success(response.data.message);
					}else {
						message.error(response.data.message);
					}
					form.resetFields();
					this.setState({
						currentNews: null,
			      visibleNewsEditModal: false,
			    });
					this.fetchData();
				})
				.catch(err => {
					console.log(err);
				})
      }
    });
  }

  handleCancel = (e) => {
    this.setState({ visibleNewsEditModal: false }, ()=>{
			if (this.state.currentNews) {
				this.setState({currentNews: null});
				this.formRef.props.form.resetFields();
				//TODO 目前无法清除编辑器中内容
			}
		});
  }

	handleDelete = (e, id) => {
		let that = this;
		confirm({
	    title: '确认删除吗?',
	    onOk() {
	      return new Promise((resolve, reject) => {
					axios.get(`${prefixAPI}/news/${id}/delete`)
					.then(res => {
						if (res.data.status == 0) {
							message.success(res.data.message);
							that.fetchData();
						}else {
							message.error(res.data.message);
						}
						resolve();
					})
					.catch(err => {
						console.log(err);
					})
	      }).catch(() => console.log('Oops errors!'));
	    },
	    onCancel() {},
	  });

	}
	//new function
}

const NewsEditForm = Form.create()(
	class extends React.Component{
		normFile = (e) => {
	    console.log('Upload event:', e);
	    if (Array.isArray(e)) {
	      return e;
	    }
	    return e && e.fileList;
	  }

		render() {
			const { visible, onCancel, onSubmit, form, title, types } = this.props;
			const { getFieldDecorator } = form;
			return (
				<Modal
          visible={visible}
          title={title}
          okText="保存"
          onCancel={onCancel}
          onOk={onSubmit}
					maskClosable={false}
					width={1200}
					centered={true}
					bodyStyle={{height: '80vh', overflow: 'auto'}}
        >
					<Form style={{ paddingTop:20 }}>
						<FormItem {...formItemLayout} label="标题">
							{getFieldDecorator('title', {
								rules: [{
									required: true,
									message: '标题不能为空！',
								}]
							})(
								<Input placeholder="请输入标题" />
							)}
						</FormItem>
						<FormItem {...formItemLayout} label="栏目">
							{getFieldDecorator('type', {
								rules: [{
									required: true,
									message: '栏目不能为空！',
								}],
							})(
								<Select placeholder="请选择栏目">
									{types.map(type => (
										<Option key={type.code}>{type.name}</Option>
									))}
						    </Select>
							)}
						</FormItem>
						<FormItem {...formItemLayout} label="作者">
							{getFieldDecorator('author', {
								rules: [{
									required: true,
									message: '作者不能为空！',
								}],
							})(
								<Input placeholder="请输入作者" />
							)}
						</FormItem>
						<FormItem {...formItemLayout} label="内容">
							{getFieldDecorator('content_raw', {
								validateTrigger: 'onBlur'
							})(
								<BraftEditor
									placeholder="请输入正文内容"
									style={{
										border: '1px solid #d1d1d1',
    								borderRadius: 5
									}}
								/>
							)}
						</FormItem>
						<Form.Item  {...formItemLayout} label="附件">
		          {getFieldDecorator('attachments', {
		            valuePropName: 'fileList',
		            getValueFromEvent: this.normFile,
		          })(
		            <Upload
									name="file"
									action={`${prefixAPI}/upload/file`}
									headers={{
				            'X-CSRF-TOKEN':document.head.querySelector('meta[name="csrf-token"]').content
				          }}
								>
		              <Button>
		                <Icon type="upload" /> 点此上传附件
		              </Button>
		            </Upload>
		          )}
		        </Form.Item>
					</Form>
				</Modal>
			)
		}
	}
)

//表单布局
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
