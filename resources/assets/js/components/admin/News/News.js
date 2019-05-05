import React, { Component } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
const FormItem = Form.Item;

export default class News extends React.Component {
  constructor(props) {
    super();
    this.state = {
			news: [],
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
		  dataIndex: 'type',
		  key: 'type',
		}, {
		  title: '作者',
		  dataIndex: 'author',
		  key: 'author',
		}, {
		  title: '创建时间',
		  dataIndex: 'created_at',
		  key: 'created_at',
		}];
    return (
      <div style={{ padding:20 }}>
				<Button type="primary" onClick={this.showNewsEditModal}>发布新闻</Button>
      	<Table dataSource={this.state.news} columns={columns} loading={this.state.loading} />

				<NewsEditForm
					wrappedComponentRef={inst => this.formRef = inst}
					visible={this.state.visibleNewsEditModal}
					onCancel={this.handleCancel}
					onSubmit={this.handleSubmit}
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
			news.map(currentNews => {
				currentNews.key = currentNews.id;
			})
			this.setState({
				news: news,
				loading: false,
			})
		})
		.catch(err => {
			console.log(err);
		})
	}

	showNewsEditModal = () => {
    this.setState({
      visibleNewsEditModal: true,
    });
  }

  handleSubmit = (e) => {
		let form = this.formRef.props.form;
		form.validateFields((err, values) => {
      if (!err) {
				axios.post(`${prefixAPI}/news`, values)
				.then(response => {
					message.success(response.data.message);
					form.resetFields();
					this.setState({
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
    this.setState({
      visibleNewsEditModal: false,
    });
  }
	//new function
}

const NewsEditForm = Form.create()(
	class extends React.Component{
		render() {
			const { visible, onCancel, onSubmit, form } = this.props;
			const { getFieldDecorator } = form;
			return (
				<Modal
          visible={visible}
          title="发布新闻"
          okText="保存"
          onCancel={onCancel}
          onOk={onSubmit}
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
								<Input placeholder="请输入栏目" />
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
					</Form>
				</Modal>
			)
		}
	}
)

//表单布局
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};
