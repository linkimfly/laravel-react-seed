@extends(themeUrl('layouts.app'))

@section('content')
<div class="common__container">
	<div class="news__show__content">
		<span>您现在的位置：{{ $currentNews->type->name }}</span>
		<h1>{{ $currentNews->title }}</h1>
		<div class="">
			{!! $currentNews->content_html !!}
		</div>
	</div>
</div>
@endsection
