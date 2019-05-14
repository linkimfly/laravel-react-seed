@extends(themeUrl('layouts.app'))

@section('content')
<div class="common__container">
	<div id="carousel-example-generic" class="carousel slide" data-ride="carousel">
	  <!-- Indicators -->
	  <ol class="carousel-indicators">
	    <li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>
	    <li data-target="#carousel-example-generic" data-slide-to="1"></li>
	  </ol>

	  <!-- Wrapper for slides -->
	  <div class="carousel-inner" role="listbox">
	    <div class="item active">
	      <img src="/images/default-cover.jpeg" alt="...">
	      <div class="carousel-caption">
	        1111111
	      </div>
	    </div>
	    <div class="item">
	      <img src="/images/default-cover.jpeg" alt="...">
	      <div class="carousel-caption">
	        222222
	      </div>
	    </div>
	  </div>

	  <!-- Controls -->
	  <a class="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
	    <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
	    <span class="sr-only">Previous</span>
	  </a>
	  <a class="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
	    <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
	    <span class="sr-only">Next</span>
	  </a>
	</div>
</div>

<div class="common__container home__news">
	<div class="common_row">
		<div class="common_col_6">
			<div class="home__news__card">
				<h2>新闻通知</h2> <a href="#">更多</a>
				@foreach( $notices as $currentNews)
					<a href="{{ route('news.show', $currentNews->id) }}">
						<p>{{ $currentNews->title }}</p>
					</a>
				@endforeach
			</div>
		</div>
		<div class="common_col_6">
			<div class="common_row">
				<div class="home__news__card">
					<h2>资料下载</h2> <a href="#">更多</a>
					@foreach( $downloads as $currentNews)
						<a href="{{ route('news.show', $currentNews->id) }}">
							<p>{{ $currentNews->title }}</p>
						</a>
					@endforeach
				</div>
			</div>
			<div class="common_row">
				<div class="home__news__card">
					<h2>往届作品展示</h2> <a href="#">更多</a>
					@foreach( $productions as $currentNews)
						<a href="{{ route('news.show', $currentNews->id) }}">
							<p>{{ $currentNews->title }}</p>
						</a>
					@endforeach
				</div>
			</div>
		</div>
	</div>
</div>

<div class="common__container home_links">
	<h2>相关链接</h2>
	<div class="common_row">
		<div class="common_col_3">
			<img src="/images/default-cover.jpeg" style="width:100%" />
		</div>
		<div class="common_col_3">
			<img src="/images/default-cover.jpeg" style="width:100%" />
		</div>
		<div class="common_col_3">
			<img src="/images/default-cover.jpeg" style="width:100%" />
		</div>
		<div class="common_col_3">
			<img src="/images/default-cover.jpeg" style="width:100%" />
		</div>
	</div>
</div>

@endsection
