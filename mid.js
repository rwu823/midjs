!function (factory){
    if(typeof module === 'object' && typeof module.exports === 'object'){
        module.exports = factory()
    }else if (typeof define === 'function' && define.amd) {
        define([], factory)
    }else{
        this.Mid = factory()
    }
}(function (){

    var slice = Array.prototype.slice

    function toArray(args, idx){
        return slice.call(args, idx)
    }

    var nextTick = typeof setImmediate === 'function' ? setImmediate : function (fn) {
        setTimeout(fn, 0)
    }

    var Mid = (function (){
        var proto = Mid.prototype

        function Mid(type){
            var _this = this

            if(!/^a?sync$/.test(type)) {
                throw new Error(
                    '[Mid.js] \n' +
                    '\tinvalid type: "' + type + '"\n' +
                    '\trequire type: "sync" or "async"'
                )
            }

            _this.type = type
            _this._useFns = []
            _this._doneFns = []
            _this._onceFn = null

            nextTick(function (){

                var firstDone = _this._doneFns.shift()
                var useFnCounts = _this._useFns.length

                    ;({
                    'async': function (){
                        var next = function (){
                            useFnCounts -= 1

                            if(firstDone){
                                firstDone(useFnCounts)
                            }

                            if(useFnCounts === 0){

                                if(_this._onceFn){
                                    _this._onceFn()
                                }

                                for(var i = 0, doneFn; doneFn = _this._doneFns[i]; i++){
                                    doneFn()
                                }
                            }
                        }

                        for(var i = 0, useFn; useFn = _this._useFns[i]; i++){
                            useFn(next)
                        }
                    },

                    'sync': function (){
                        function gen(useFns){
                            var next = function(){
                                var args = toArray(arguments)

                                if(useFns[gen.idx]){
                                    args.push(next)
                                    useFns[gen.idx].apply(null, args)
                                    gen.idx += 1
                                }
                                else if(firstDone) firstDone()

                            }

                            gen.idx = 0
                            next()
                        }

                        gen(_this._useFns)
                    }
                })[type]()

            })

            return _this
        }

        proto.use = function (fn){
            this._useFns.push(fn)
            return this
        }

        proto.done = function (fn){
            this._doneFns.push(fn)
            return this
        }

        proto.once = function (fn){
            this._onceFn = fn
            return this
        }

        function mid(type){
            return new Mid(type)
        }

        return mid
    })()

    return Mid
})