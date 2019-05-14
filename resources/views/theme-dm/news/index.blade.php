@extends(themeUrl('layouts.app'))

@section('content')
<div class="common__container">
	<div class="news__index__content">
		<h1>{{ $type }}</h1>
		@foreach( $news as $currentNews)
			<a href="{{ route('news.show', $currentNews->id) }}">
				<p>{{ $currentNews->title }}</p>
			</a>
		@endforeach
		{{ $news->appends(['type' => $type])->links() }}
	</div>
</div>
@endsection
