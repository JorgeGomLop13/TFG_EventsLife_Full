<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ __('messages.event_codes_title') }}</title>
</head>
<body>
    <h1>{{ __('messages.participation_codes') }}</h1>
	<!--Bucle para mostrar todos los codigos de los usuarios y que el organizador pueda 'pasar lista'-->
    <ul>
        @foreach ($codes as $code)
            <li>{{ $code }}</li>
        @endforeach
    </ul>
</body>
</html>