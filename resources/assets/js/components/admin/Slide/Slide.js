import React, { Component } from 'react';
import { Table, Button, Form, Modal, Spin, Input, Upload, Icon, message, Select, InputNumber } from 'antd';
const ButtonGroup = Button.Group;
const FormItem = Form.Item;
const Option = Select.Option;

export default class Slides extends React.Component {
  constructor(props) {
    super();
    this.state = {
			slides: [],
			loading: true,
			slide: null,
			slideEditModalLoading: false,
			visibleSlideEditModal: false,
    };
  }
	componentWillMount(){
		this.fetchData();
	}
  render(){
		const columns = [{
		  title: '轮播图',
		  key: 'cover',
			width: 200,
			render: (text, record) => (
				<img src={record.cover} alt="cover" style={{ width:'100%' }}/>
			)
		}, {
		  title: '类型',
		  key: 'type',
			render: (text, record) => {
				switch (record.type) {
					case 'internal': return '站内跳转'; break;
					case 'external': return '外部链接'; break;
					case 'none': return '不跳转'; break;
					default: return ''; break;
				}
			}
		}, {
		  title: '标题',
		  key: 'title',
			render: (text, record) => {
				if (record.target) {
					return <a href={record.target} target="__blank">{record.title}</a>
				}else {
					return <span>{record.title}</span>
				}
			}
		}, {
		  title: '点击量',
		  dataIndex: 'click',
		  key: 'click',
		}, {
		  title: '优先级',
		  dataIndex: 'priority',
		  key: 'priority',
		}, {
      title: '操作',
      key: 'action',
      width: 250,
      render: (text, record) => (
        <span>
          <ButtonGroup>
						<Button onClick={e => {this.showSlideEditModal(e, '编辑轮播', record.id)}}>编辑</Button>
            <Button onClick={e => {this.handleDelete(e, record.id)}}>删除</Button>
          </ButtonGroup>
        </span>
      ),
    }];
    return (
      <div style={{ padding: 20 }}>
				<div style={{overflow:'hidden'}}>
					<Button type="primary" onClick={e => {this.showSlideEditModal(e, '新增轮播')}} style={{ float: 'right' }}>新增轮播</Button>
				</div>

				<Table
					bordered
					dataSource={this.state.slides}
					columns={columns}
					pagination={false}
					loading={this.state.loading}
					style={{ marginTop: 10 }}
				/>

				<SlideEditForm
					wrappedComponentRef={inst => this.formRef = inst}
					visible={this.state.visibleSlideEditModal}
					onCancel={this.handleCancel}
					onSubmit={this.handleSubmit}
					title={this.state.slideEditModalTitle}
					loading={this.state.slideEditModalLoading}
				/>
			</div>
    )
  }
	fetchData = () => {
		if (this.state.loading != true) {
			this.setState({loading: true});
		}

		axios.get(`${prefixAPI}/slides`)
		.then(response => {
			let slides = response.data.slides;
			slides.map(slide => {
				slide.key = slide.id;
			})
			this.setState({
				slides: slides,
				loading: false,
			})
		})
		.catch(err => {
			console.log(err);
		})
	}

	showSlideEditModal = (e, title=null, id=null) => {
		this.setState({
			slideEditModalTitle: title,
			visibleSlideEditModal: true,
		});
		// if (id) {
		// 	this.setState({ slideEditModalLoading: true });
		// 	axios.get(`${prefixAPI}/slides/${id}`)
		// 	.then(res => {
		// 		let slide = res.data.slide;
		// 		this.formRef.props.form.setFieldsValue({
		// 			cover: slide.cover,
		// 			type: slide.type,
		// 			title: slide.title,
		// 			target: slide.target,
		// 			priority: slide.priority,
		// 		});
		// 		this.setState({
		// 			slide: slide,
		// 			slideEditModalLoading: false,
		// 		});
		// 	})
		// 	.catch(err => {
		// 		console.log(err);
		// 	})
		// }
  }

	handleCancel = (e) => {
    this.setState({ visibleSlideEditModal: false }, ()=>{
			if (this.state.slide) {
				this.setState({slide: null});
				this.formRef.props.form.resetFields();
			}
		});
		this.setState({ slideEditModalLoading: false });
  }

	handleSubmit = (e) => {
		let form = this.formRef.props.form;
		form.validateFields((err, values) => {
      if (!err) {
				if (this.state.slide) {
					values.id = this.state.slide.id;
				}

				const formData = new FormData();
        Object.keys(values).forEach((key) => {
            if (values[key]) {
                if (key == 'cover') {
									let fileList = values[key];
                  formData.append(key, fileList[fileList.length-1].originFileObj);
                }else {
                  formData.append(key, values[key]);
                }
            }
        })

				axios.post(`${prefixAPI}/slides`, formData)
				.then(response => {
					if (response.data.status == 0) {
						message.success(response.data.message);
						form.resetFields();
						this.setState({
							slide: null,
				      visibleSlideEditModal: false,
				    });
						this.formRef.deleteCoverUrlTemp();
						this.fetchData();
					}else {
						message.error(response.data.message);
					}
				})
				.catch(err => {
					console.log(err);
				})
      }
    });
  }
	// new function
}

const SlideEditForm = Form.create()(
	class extends React.Component{
		constructor(props) {
	    super();
	    this.state = {
	    };
	  }
		render() {
			const { visible, onCancel, onSubmit, form, title, loading } = this.props;
			const { getFieldDecorator } = form;

			const generateFormByType = () => {
				switch (this.state.currentSelect) {
					case 'internal':
						return (
							<React.Fragment>
								<FormItem {...formItemLayout} label="文章 ID">
									{getFieldDecorator('news_id')(
										<InputNumber min={1} />
									)}
								</FormItem>
							</React.Fragment>
						)
						break;
					case 'external':
						return (
							<React.Fragment>
								<FormItem {...formItemLayout} label="标题">
									{getFieldDecorator('title')(
										<Input placeholder="请输入标题" />
									)}
								</FormItem>
							</React.Fragment>
						)
						break;
					case 'none':
						return (
							<React.Fragment>
							</React.Fragment>
						)
						break;
					default:
						return '';
						break;
				}
			}

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
							<FormItem {...formItemLayout} label="轮播图片">
		            {getFieldDecorator('cover', {
									rules: [{
										required: true,
										message: '请设置轮播图片！'
									}],
		              valuePropName: 'fileList',
		              getValueFromEvent: this.normFile,
		            })(
		              <Upload
								      listType="picture-card"
								      showUploadList={false}
								      beforeUpload={this.beforeUpload}
								      headers={{
								        'X-CSRF-TOKEN':document.head.querySelector('meta[name="csrf-token"]').content
								      }}
									>
		                {this.state.coverUrlTemp ? <img src={this.state.coverUrlTemp} style={{width:'100%'}} alt="cover" /> : (
								      <div>
								        <Icon type='plus' />
								        <span>Upload</span>
								      </div>
										)}
		              </Upload>
		            )}
		          </FormItem>
							<FormItem {...formItemLayout} label="类型">
								{getFieldDecorator('type', {
									rules: [{
										required: true,
										message: '请选择类型！',
									}],
								})(
									<Select placeholder="请选择类型" onChange={this.handleSelectChange}>
										<Option key="internal">站内跳转</Option>
										<Option key="external">外部链接</Option>
										<Option key="none">不跳转</Option>
							    </Select>
								)}
							</FormItem>
							{generateFormByType()}
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

	  beforeUpload = (file) => {
			const isJPGPNG = ~['image/jpeg', 'image/png'].indexOf(file.type);
	    if (!isJPGPNG) {
	      message.error('仅支持上传 JPG、PNG 格式的图片!');
	    }
	    const isLt1M = file.size / 1024 / 1024 < 1;
	    if (!isLt1M) {
	      message.error('图片大小不能大于1MB!');
	    }
	    if (isJPGPNG && isLt1M) {
	        this.getBase64(file, imageUrl => this.setState({
	          coverUrlTemp: imageUrl
	        }));
	    }
	    return false;
	  }

		getBase64 = (img, callback) => {
	    const reader = new FileReader();
	    reader.addEventListener('load', () => callback(reader.result));
	    reader.readAsDataURL(img);
	  }

		handleSelectChange = (value) => {
			this.setState({ currentSelect: value });
		}

		deleteCoverUrlTemp = () => {
			this.setState({ coverUrlTemp: null });
		}
	}
)

//表单布局
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
