import React, { Component } from 'react';
import { Table } from 'antd';

export default class News extends React.Component {
  constructor(props) {
    super();
    this.state = {
			news:[
				{key:1, title:'示例标题', type:'新闻通知', author:'电子科技大学', created_at:'2019-05-04 17:00'},
				{key:2, title:'示例标题', type:'资料下载', author:'电子科技大学', created_at:'2019-05-04 17:00'},
				{key:3, title:'示例标题', type:'往届作品展示', author:'电子科技大学', created_at:'2019-05-04 17:00'},
			]
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
      	<Table dataSource={this.state.news} columns={columns} />
      </div>
    )
  }
}
