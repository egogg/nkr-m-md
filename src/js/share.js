;( function( $, window, document, undefined ) {

    "use strict";

        // Create the defaults once
        var pluginName = "share",
            defaults = {
            };

        // The actual plugin constructor
        function Plugin ( element, options ) {
            this.element = element;
            this.settings = $.extend( {}, defaults, options );
            this._defaults = defaults;
            this._name = pluginName;
            this.init();
        }

        $.extend( Plugin.prototype, {
            init: function() {

                //微博专用
                this.__title           = options.title || '';
                this.__pic             = options.pic || '';

                //QQ、微信、易信
                this.__mTitle       = options.mTitle || '';
                this.__mDescription = options.mDescription || '';
                this.__mPic         = options.mPic || '';

                this.__url             = options.url || window.location.href;
                this.__mobileUrl    = options.mobileUrl || this.__url; // 移动端分享的链接 
                this.__weixinQR        = options.weixinQR || '';

                this.configData();
            },
            configData: function() {

                //set the shareID
                this.__shareID = {};
                this.__shareID.sina = {};
                this.__shareID.sina.id        = ''; //sina weibo appID
                this.__shareID.sina.ralateUid = '';//sina weibo @userID
                this.__shareID.renren  = '';

                this.__window = _ustr.join(',');
            },
            shareQzone: function(){
                var _param = {
                    url: this.__url,
                    title: this.__mTitle,
                    pics: this.__mPic,
                    summary: this.__mDescription
                }
                var arr = [];

                for( var tmp in _param ){
                    arr.push(tmp + '=' + encodeURIComponent( _param[tmp] || '' ) )
                }

                url = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?' 
                      + arr.join('&');
                window.open(url, 'Qzone', this.__window);
            },
            shareQQ: function(){
                var _param = {
                    url: this.__url,
                    title: this.__mTitle,
                    pics: this.__mPic,
                    summary: this.__mDescription
                }
                var arr = [];

                for( var tmp in _param ){
                    arr.push(tmp + '=' + encodeURIComponent( _param[tmp] || '' ) )
                }

                url = 'http://connect.qq.com/widget/shareqq/index.html?' + arr.join('&');
                window.open(url, 'QQ', this.__window);
            },
            shareDouban: function(){
                var _param = {
                    href: this.__url,
                    name: this.__mTitle,
                    image: this.__mPic,
                    text: this.__mDescription
                }
                var arr = [];

                for( var tmp in _param ){
                    arr.push(tmp + '=' + encodeURIComponent( _param[tmp] || '' ) )
                }

                url = 'https://www.douban.com/share/service?' + arr.join('&');
                window.open(url, 'Douban', this.__window);
            },
            shareSina: function(){
                var param = {
                    url:this.__url,
                    appkey:this.__shareID.sina.id, /**你申请的应用appkey,显示分享来源(可选)*/
                    title:this.__title, /**分享的文字内容(可选，默认为所在页面的title)*/
                    pic:this.__pic, /**分享图片的路径(可选)*/
                    /**关联用户的UID，分享微博会@该用户(可选)*/
                    ralateUid:this.__shareID.sina.ralateUid, 
                    language:'zh_cn' /**设置语言，zh_cn|zh_tw(可选)*/
                }
                var arr = [];

                for( var tmp in param ){
                    arr.push(tmp + '=' + encodeURIComponent( param[tmp] || '' ) )
                }

                url = 'http://service.weibo.com/share/share.php?' + arr.join('&');
                window.open(url, "_blank", this.__window); 
            },
            shareYixin: function(link){
                var _param = {
                    appkey : '',
                    type : 'webpage',
                    title : '网易云课堂',
                    desc : this.__title,
                    userdesc : '',
                    pic : this.__pic,
                    url : this.__url
                }
                var arr = [];

                for(var tmp in _param){
                    arr.push(tmp + '=' + encodeURIComponent( _param[tmp] || '' ));
                }

                url = 'http://open.yixin.im/share?' + arr.join('&');
            },
            shareRenren: function(){
                var rrShareParam = {
                    api_key:this.__shareID.renren,
                    resourceUrl : '',   //分享的资源Url
                    //分享的资源来源Url,默认为header中的Referer
                    //如果分享失败可用resourceUrl试试
                    srcUrl : this.__url,    
                    pic : this.__pic,       //分享的主题图片Url
                    title : this.__title,     //分享的标题
                    description : this.__mDescription    //分享的详细描述
                };

                var hl = location.href.indexOf('#');
                var resUrl = (hl == -1 ? location.href : location.href.substr(0, hl));
                var shareImgs = "";

                var getParam = function(param) {
                    param = param || {};
                    param.api_key = param.api_key || '';
                    param.resourceUrl = param.resourceUrl || resUrl;
                    param.title = param.title || '';
                    param.pic = param.pic || '';
                    param.description = param.description || '';
                    if (resUrl == param.resourceUrl) {
                        //一般就是当前页面的分享,因此取当前页面的img
                        param.images = param.images || shareImgs;
                    }
                    param.charset = param.charset || '';
                    return param;
                }

                var submitUrl = 'http://widget.renren.com/dialog/share';
                var p = getParam(rrShareParam);

                var prm = [];
                for (var i in p) {
                    if (p[i])
                        prm.push(i + '=' + encodeURIComponent(p[i]));
                }

                var url = submitUrl + "?" + prm.join('&'),
                     //maxLgh = (eu._$isIE ? 2048 : 4100), //不知道干嘛用的
                    wa = 'width=700,height=650,left=0,top=0,resizable=yes,scrollbars=1';
                window.open(url, 'renren', wa);
            }
        });

        // A really lightweight plugin wrapper around the constructor,
        // preventing against multiple instantiations
        $.fn[ pluginName ] = function( options ) {
            return this.each( function() {
                if ( !$.data( this, "plugin_" + pluginName ) ) {
                    $.data( this, "plugin_" +
                        pluginName, new Plugin( this, options ) );
                }
            } );
        };
})( jQuery, window, document );