import React, { Component } from 'react';
import { Form, Spin, Icon, Input, Button, message } from 'antd';
const FormItem = Form.Item;

export class SettingWeb extends React.Component {
  render(){
    return (
			<WrappedSettingWebForm />
    )
  }
}

const WrappedSettingWebForm = Form.create()(
	class extends React.Component {
		state={
	    loading: true,
	    formData:{
				web_name:'',
	      admin_name:'',
	    }
	  }
	  componentWillMount() {
	    axios.get(`${prefixAPI}/settings?keys=${Object.keys(this.state.formData).join(',')}`)
	    .then((response) => {
	      console.log(response);
	      this.setState({
	        loading: false,
	        formData: response.data.settings
	      });
	    })
	    .catch((error) => {
	      console.log(error);
	    });
	  }
	  render() {
	    const { getFieldDecorator } = this.props.form;
	    const formData = this.state.formData;

	    if (this.state.loading) {
	      return (
	        <Spin
	          style={{margin:'30px 50%'}}
	          indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}
					/>
	      )
	    }else {
	      return (
	        <Form onSubmit={this.handleSubmit} style={{ paddingTop:20 }}>
	          <FormItem {...formItemLayout} label="网站前台名称">
	            {getFieldDecorator('web_name', {
	              rules: [{
	                required: true,
	                message: '网站前台名称不能为空！',
	              }],
	              initialValue: formData.web_name
	            })(
	              <Input placeholder="请输入网站前台名称" />
	            )}
	          </FormItem>
						<FormItem {...formItemLayout} label="网站后台名称">
	            {getFieldDecorator('admin_name', {
	              rules: [{
	                required: true,
	                message: '网站后台名称不能为空！',
	              }],
	              initialValue: formData.admin_name
	            })(
	              <Input placeholder="请输入网站后台名称" />
	            )}
	          </FormItem>
	          <FormItem {...formTailLayout}>
	            <Button type="primary" htmlType="submit">
	              保存
	            </Button>
	          </FormItem>
	        </Form>
	      )
	    }
	  }
	  //表单提交
	  handleSubmit = (e) => {
	    e.preventDefault();
	    this.props.form.validateFields((err, values) => {
	      if (!err) {
	        axios.post(`${prefixAPI}/settings`, values)
	        .then(function (response) {
	          message.success(response.data.message);
	          location.reload();
	        })
	        .catch(function (error) {
	          console.log(error);
	        });
	      }
	    });
	  }
	}
)

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};
