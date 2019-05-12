import React, { Component } from 'react';
import { Table, Button } from 'antd';
const ButtonGroup = Button.Group;

export default class Slides extends React.Component {
  constructor(props) {
    super();
    this.state = {
			slides: [],
			loading: true,
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
				<Table
					bordered
					dataSource={this.state.slides}
					columns={columns}
					loading={this.state.loading}
					style={{ marginTop: 10 }}
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
	// new function
}
