import React, { Component } from 'react';
import { Table, Button, Modal, Form, Input, message, Select, Upload, Icon, Tag, Spin, DatePicker } from 'antd';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import moment from 'moment';
const ButtonGroup = Button.Group;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
const Search = Input.Search;

export default class News extends React.Component {
  constructor(props) {
    super();
    this.state = {
			news: [],
			order: null,
			isTop: null,
			search: null,
			pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
				pageSizeOptions: ['5', '10', '15', '20'],
        defaultCurrent: 1,
        defaultPageSize: 10
      },
			currentNews: null,
			types: [],
			loading: true,
			newsEditModalLoading: false,
			visibleNewsEditModal: false,
    };
  }
	componentWillMount(){
		this.fetchData();
	}
  render(){
		const columns = [{
		  title: 'ID',
		  dataIndex: 'id',
		  key: 'id',
			width: 50,
		}, {
		  title: '标题',
		  key: 'title',
			render: (text, record) => (
				<div>
					<span style={{ marginRight: 5 }}>{record.title}</span>
					{record.is_top ? <Tag color="blue">置顶</Tag> : ''}
				</div>
			)
		}, {
		  title: '栏目',
		  dataIndex: 'type.name',
		  key: 'type',
			width: 120,
		}, {
		  title: '作者',
		  dataIndex: 'author',
		  key: 'author',
			width: 120,
		}, {
		  title: '浏览量',
		  dataIndex: 'view',
		  key: 'view',
			width: 80,
		}, {
		  title: '创建时间',
		  dataIndex: 'created_at',
		  key: 'created_at',
			width: 160,
		}, {
      title: '操作',
      key: 'action',
      width: 250,
      render: (text, record) => (
        <span>
          <ButtonGroup>
						<Button onClick={e => {this.showNewsEditModal(e, '编辑新闻', record.id)}}>编辑</Button>
						<Button onClick={e => {this.handleTop(e, record.id)}}>置顶</Button>
            <Button onClick={e => {this.handleDelete(e, record.id)}}>删除</Button>
          </ButtonGroup>
        </span>
      ),
    }];
    return (
      <div style={{ padding:20 }}>
				<div style={{overflow:'hidden'}}>
					<span className="news__header__text" style={{ marginLeft: 10 }}>排序方式</span>
          <Select defaultValue="created_at_desc" style={{ width: 120, margin: '0 10px' }} onChange={this.handleChangeOrder}>
						<Option value="created_at_desc">最新发布</Option>
            <Option value="created_at">最早发布</Option>
            <Option value="view_desc">最多浏览</Option>
          </Select>
					<span className="news__header__text">筛选条件</span>
          <Select placeholder="按置顶状态" style={{ width: 140, margin: '0 10px' }} onChange={this.handleChangeTop} allowClear>
						<Option value={1}>置顶</Option>
            <Option value={0}>未置顶</Option>
          </Select>
					<span className="news__header__text">搜索</span>
          <Search
            placeholder="输入标题关键字"
            onSearch={this.handleSearch}
            style={{ width: 200, margin: '0 10px' }}
          />
					<Button type="primary" onClick={e => {this.showNewsEditModal(e, '发布新闻')}} style={{ float: 'right' }}>发布新闻</Button>
        </div>

      	<Table
					bordered
					dataSource={this.state.news}
					columns={columns}
					pagination={this.state.pagination}
					loading={this.state.loading}
					onChange={this.handleTableChange}
					style={{ marginTop: 10 }}
				/>

				<NewsEditForm
					wrappedComponentRef={inst => this.formRef = inst}
					visible={this.state.visibleNewsEditModal}
					onCancel={this.handleCancel}
					onSubmit={this.handleSubmit}
					title={this.state.newsEditModalTitle}
					types={this.state.types}
					loading={this.state.newsEditModalLoading}
				/>
      </div>
    )
  }

	fetchData = (currentPage=null, pageSize=null) => {
		if (this.state.loading != true) {
			this.setState({loading: true});
		}

		const pager = { ...this.state.pagination };
    if (!currentPage) {
      currentPage = pager.current || pager.defaultCurrent;
    }
    if (!pageSize) {
      pageSize = pager.pageSize || pager.defaultPageSize;
    }

		let params = `?page_size=${pageSize}&page=${currentPage}&order=${this.state.order || 'created_at_desc'}`;
		if (this.state.isTop) {
			params += `&is_top=${this.state.isTop}`;
		}
		if (this.state.search) {
			params += `&search=${this.state.search}`;
		}

		axios.get(`${prefixAPI}/news${params}`)
		.then(response => {
			let news = response.data.news;
			let types = response.data.types;
			const pager = { ...this.state.pagination };
			pager.total = news.total;
			pager.current = news.current_page;
			pager.pageSize = Number(news.per_page);
			news.data.map(currentNews => {
				currentNews.key = currentNews.id;
			})
			this.setState({
				news: news.data,
				pagination: pager,
				types: types,
				loading: false,
			})
		})
		.catch(err => {
			console.log(err);
		})
	}

	showNewsEditModal = (e, title=null, id=null) => {
		this.setState({
			newsEditModalTitle: title,
			visibleNewsEditModal: true,
		});
		if (id) {
			this.setState({ newsEditModalLoading: true });
			axios.get(`${prefixAPI}/news/${id}`)
			.then(res => {
				let currentNews = res.data.current_news;
				this.formRef.props.form.setFieldsValue({
					title: currentNews.title,
					type: currentNews.type,
					author: currentNews.author,
					content_raw: BraftEditor.createEditorState(JSON.parse(currentNews.content_raw)),
					attachments: JSON.parse(currentNews.attachments),
					created_at: moment(currentNews.created_at),
				});
				this.setState({
					currentNews: currentNews,
					newsEditModalLoading: false,
				});
			})
			.catch(err => {
				console.log(err);
			})
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
				}else {
					delete values.attachments
				}
				if (values.created_at) {
					values.created_at = values.created_at.format('YYYY-MM-DD HH:mm:ss');
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
				this.formRef.props.form.setFieldsValue({
					content_raw: BraftEditor.createEditorState(null)
				});
			}
		});
		this.setState({ newsEditModalLoading: false });
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

	handleTop = (e, id) => {
		axios.get(`${prefixAPI}/news/${id}/top`)
		.then(res => {
			if (res.data.status == 0) {
				message.success(res.data.message);
				this.fetchData();
			}else {
				message.error(res.data.message);
			}
		})
		.catch(err => {
			console.log(err);
		})
	}

	handleChangeOrder = (value) => {
		this.setState({ order: value }, () => this.fetchData());
	}

	handleChangeTop = (value) => {
		this.setState({ isTop: value }, () => this.fetchData());
	}

  handleSearch = (value) => {
    this.setState({ search:value }, () => this.fetchData());
  }

	handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetchData(pagination.current, pagination.pageSize);
  }
	//new function
}

const NewsEditForm = Form.create()(
	class extends React.Component{
		render() {
			const { visible, onCancel, onSubmit, form, title, types, loading } = this.props;
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
					<Spin spinning={loading}>
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
										media={{
	                    uploadFn:this.uploadFn,
	                    accepts:{
	                      image: 'image/png,image/jpeg,image/gif',
	                      video: 'video/mp4',
												audio: false,
	                    }
	                  }}
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
							<Form.Item {...formItemLayout} label="创建时间">
								{getFieldDecorator('created_at')(
									<DatePicker
							      showTime
							      placeholder="点此选择日期时间"
							    />
								)}
							</Form.Item>
						</Form>
					</Spin>
				</Modal>
			)
		}
		normFile = (e) => {
			console.log('Upload event:', e);
			if (Array.isArray(e)) {
				return e;
			}
			return e && e.fileList;
		}

		uploadFn = (param) => {
			const serverURL = `${prefixAPI}/upload/file`
			const xhr = new XMLHttpRequest
			const fd = new FormData()

			const successFn = (response) => {
				// 假设服务端直接返回文件上传后的地址
				// 上传成功后调用param.success并传入上传后的文件地址
				param.success({
					url: JSON.parse(xhr.responseText).url
				})
			}
			const progressFn = (event) => {
				// 上传进度发生变化时调用param.progress
				param.progress(event.loaded / event.total * 100)
			}
			const errorFn = (response) => {
				// 上传发生错误时调用param.error
				param.error({
					msg: '上传失败！'
				})
			}
			xhr.upload.addEventListener("progress", progressFn, false)
			xhr.addEventListener("load", successFn, false)
			xhr.addEventListener("error", errorFn, false)
			xhr.addEventListener("abort", errorFn, false)

			fd.append('file', param.file)
			xhr.open('POST', serverURL, true)
			xhr.setRequestHeader('X-CSRF-TOKEN', document.head.querySelector('meta[name="csrf-token"]').content);
			xhr.send(fd)
		}
	}
)

//表单布局
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
