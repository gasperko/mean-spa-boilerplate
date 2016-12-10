# JSEL (JavaScript Error Log)

A simple JavaScript error logger in server

## TL;DR

### Server

```bash
git clone git@bitbucket.org:corefront/js-error-log.git
cd js-error-log
npm install
node server.js
```

### Client

```html
<script>
	window.JSEL = {
		url: 'https://example.com/error',
		type: 'image' // image, ajax
	};
</script>
<script src="jsel.js"></script>
```

## License

[![MIT Licence](https://img.shields.io/badge/licence-MIT-blue.svg)](https://magno.mit-license.org/2016)
