//**************************************************************  
// jQZoom allows you to realize a small magnifier window,close  
// to the image or images on your web page easily.  
//  
// jqZoom version 2.1  
//**************************************************************  
(function ($) {
    var defaults = {
        xzoom: 336,       //zoomed width default width
        yzoom: 336,       //zoomed div default width
        offset: 30,       //zoomed div default offset
        position: "right",//zoomed div default position,offset position is to the right of the image
        lens: true,       //zooming lens over the image,by default is true;
        bigImageUrlAttribute: 'jqimg',
        zoomClassName: 'zoomdiv',
        zoomPupClassName: 'jqZoomPup',
        zoomBigImageClassName: 'bigimg'
    };
    $.fn.jqueryzoom = function (options) {
        var $el = $(this),
            noalt = '',
            settings = $.extend({}, defaults, options || {}),
            throttleScaleMove = (typeof _ !== 'undefined' && _.throttle) ? _.throttle(scaleMove, 50, {trailing: false}) : scaleMove;
        $el.css('position', 'relative');
        $el.off('mouseenter').on('mouseenter', function () {
            var leftpos,
                imageLeft = $el.offset().left,
                imageTop = $el.offset().top,
                $image = $el.children('img').eq(0);
            if ($image.length < 1) {
                return;
            }
            var imageWidth = $image[0].offsetWidth,
                bigimageUrl = $image.attr(settings.bigImageUrlAttribute);

            noalt = $image.attr("alt");
            $image.attr("alt", '');

            if ($el.find('.' + settings.zoomClassName).length == 0) {
                $el.after(["<div class='" + settings.zoomClassName + "' style='z-index: 100; position: absolute; top:0px; left:0px; width: 200px; height:200px; background: #fff; border:1px solid #CCC; display:none;text-align: center;overflow: hidden;'>",
                    "<img class='" + settings.zoomBigImageClassName + "' src='" + bigimageUrl + "'/>",
                    "</div>"].join(''));
                $el.append("<div style='z-index: 10; visibility: hidden; position:absolute;top:0px;left:0px; border: 1px solid #fff;background:#fff;opacity: 0.5;filter: alpha(Opacity=50);' class='" + settings.zoomPupClassName + "'>&nbsp;</div>")
            }
            if (settings.position == "right") {
                if (imageLeft + imageWidth + settings.offset + settings.xzoom > screen.width) {
                    leftpos = imageLeft - settings.offset - settings.xzoom;
                } else {
                    leftpos = imageLeft + imageWidth + settings.offset;
                }
            } else {
                leftpos = imageLeft - settings.xzoom - settings.offset;
                if (leftpos < 0) {
                    leftpos = imageLeft + imageWidth + settings.offset
                }
            }
            var zoomBox = $el.siblings('.' + settings.zoomClassName).eq(0);
            zoomBox.css({
                top: imageTop,
                left: leftpos,
                width: settings.xzoom + 'px',
                height: settings.yzoom + 'px'
            }).show();
            if (!settings.lens) {
                $el.css('cursor', 'crosshair');
            }
        });
        $el.off('mousemove').on('mousemove', throttleScaleMove);
        $el.off('mouseleave').on('mouseleave', function () {
            $el.children("img").attr("alt", noalt);
            if (settings.lens) {
                $el.find('.' + settings.zoomPupClassName).remove();
            }
            $el.siblings('.' + settings.zoomClassName).remove();
        });
        function scaleMove(e) {
            var xpos, ypos, scaley = 'x', scalex = 'y',
                mousex = e.pageX,
                mousey = e.pageY,
                imageLeft = $el.offset().left,
                imageTop = $el.offset().top,
                $image = $el.children('img').eq(0),
                imageWidth = $image[0].offsetWidth,
                imageHeight = $image[0].offsetHeight,
                zoomBox = $el.siblings('.' + settings.zoomClassName).eq(0),
                zoomPupBox = $el.find('.' + settings.zoomPupClassName).eq(0),
                bigwidth = zoomBox.find('.' + settings.zoomBigImageClassName)[0].offsetWidth,
                bigheight = zoomBox.find('.' + settings.zoomBigImageClassName)[0].offsetHeight;
            if (!bigwidth || !bigheight || bigwidth < imageWidth) {
                return;
            }

            if (isNaN(scalex) | isNaN(scaley)) {
                scalex = (bigwidth / imageWidth);
                scaley = (bigheight / imageHeight);
                zoomPupBox.width((settings.xzoom) / scalex);
                zoomPupBox.height((settings.yzoom) / scaley);
                if (settings.lens) {
                    zoomPupBox.css('visibility', 'visible');
                }
            }
            xpos = mousex - zoomPupBox.width() / 2 - imageLeft;
            ypos = mousey - zoomPupBox.height() / 2 - imageTop;
            if (settings.lens) {
                xpos = (mousex - zoomPupBox.width() / 2 < imageLeft) ? 0 : (mousex + zoomPupBox.width() / 2 > imageWidth + imageLeft) ? (imageWidth - zoomPupBox.width() - 2) : xpos;
                ypos = (mousey - zoomPupBox.height() / 2 < imageTop) ? 0 : (mousey + zoomPupBox.height() / 2 > imageHeight + imageTop) ? (imageHeight - zoomPupBox.height() - 2) : ypos;
                zoomPupBox.css({
                    top: ypos,
                    left: xpos
                });
            }
            zoomBox[0].scrollTop = ypos * scaley;
            zoomBox[0].scrollLeft = (xpos) * scalex
        }
    };
})(jQuery);