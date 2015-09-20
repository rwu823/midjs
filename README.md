# mid.js

A lightweight flow control for Node and Browsers. Similar to [async.js](https://github.com/caolan/async) but more than enjoyable API :).

## Installation
	npm install mid.js --save

## Examples
Didn't use any flow control:

```js
setTimeout(function(){
	var a = doSomething()
	setTimeout(function(){
		doSomething2(a)
		setTimeout(function(){
			console.log('done')
		}, 1000)
	}, 1000)
}, 1000)
```

use mid.js

```js
mid('sync')
	.use(function(next){
		setTimeout(function(){
			var a = doSomething()
			next(a)
		}, 1000)
	})
	.use(function(a, done){
		setTimeout(function(){
			doSomething(a)
			done()
		}, 1000)
	})
	.done(function(){
		setTimeout(function(){
			console.log('done')
		}, 1000)
	})
```

async
```js
mid('async')
	.use(function(){
		$.ajax({})
	})
	.use(function(){
		$.ajax({})
	})
	.once(function(){
		// here will trigger when all async process done
	})
```

## API

### mid(['async'|'sync'])
set run `use` functions as `async` or `sync`

### use([function(...args, next)])
process functions for `async` or `sync`.
The behavior like [Express.js](http://expressjs.com/guide/using-middleware.html) middleware.

### done([function])
invoking when ecah processes done.

### once([function])
invoking once when all async process done.