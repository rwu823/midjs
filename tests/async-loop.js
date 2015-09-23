var mid = require('../mid')
var async = mid('async')

for(var i=0; i < 2; i++){
    async.use(function(done){
        setTimeout(function (){
            done()
        }, 1000)
    })
}

async.once(function (){
    console.log('done')
})