import React, { Component } from 'react';
import { Table, Button, Modal, Form, Input } from 'antd';
const FormItem = Form.Item;

export default class News extends React.Component {
  constructor(props) {
    super();
    this.state = {
			news: [
				{key:1, title:'示例标题', type:'新闻通知', author:'电子科技大学', created_at:'2019-05-04 17:00'},
				{key:2, title:'示例标题', type:'资料下载', author:'电子科技大学', created_at:'2019-05-04 17:00'},
				{key:3, title:'示例标题', type:'往届作品展示', author:'电子科技大学', created_at:'2019-05-04 17:00'},
			],
			currentNews:'111',
			visibleNewsEditModal: false,
    };
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
      	<Table dataSource={this.state.news} columns={columns} />

				<Modal
          title="Basic Modal"
          visible={this.state.visibleNewsEditModal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
					<WrappedNewsEditForm currentNews={this.state.currentNews} wrappedComponentRef={inst => this.formRef = inst} />
        </Modal>
      </div>
    )
  }
	showNewsEditModal = () => {
    this.setState({
      visibleNewsEditModal: true,
    });
  }

  handleOk = (e) => {
		this.formRef.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
				this.setState({
		      visibleNewsEditModal: false,
		    });
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

class NewsEditForm extends React.Component {
	state = {
		currentNews:{}
	}
	componentWillReceiveProps(nextProps){
		// console.log(nextProps);
	}
	render() {
		const currentNews = this.state.currentNews;
		const { getFieldDecorator } = this.props.form;
		return (
			<Form style={{ paddingTop:20 }}>
				<FormItem {...formItemLayout} label="标题">
					{getFieldDecorator('title', {
						rules: [{
							required: true,
							message: '标题不能为空！',
						}],
						initialValue: currentNews.title || ''
					})(
						<Input placeholder="请输入标题" />
					)}
				</FormItem>
			</Form>
		)
	}
}

const WrappedNewsEditForm = Form.create()(NewsEditForm);

//表单布局
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};
