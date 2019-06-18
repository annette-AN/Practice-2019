// JavaScript Document
$.fn.imageAttach = function(arg) {
    'use strict';
    
    // 유효성 검사 조건 (0 : 제한없음 / 외부파라미터 전달)
    var maxNum = (arg && arg.maxNum) ? arg.maxNum : 0;   // 첨부파일 갯수 제한 (기본 제한 없음)
    var maxSize = (arg && arg.maxSize) ? arg.maxSize : 5000;   // 첨부파일(개별) 용량 제한 (기본 5000 KB)
    var permitExt = (arg && arg.permitExt) ? arg.permitExt : ['jpg', 'png', 'gif'];   // 첨부허용된 확장자 (기본 jpg, png, gif)
    var maxWidth = (arg && arg.maxWidth) ? arg.maxWidth : 0;    // 이미지 최대폭(px) 제한 (기본 제한 없음)
    var minWidth = (arg && arg.minWidth) ? arg.minWidth : 0;    // 이미지 최소폭(px) 제한 (기본 제한 없음)
    var maxHeight = (arg && arg.maxHeight) ? arg.maxHeight : 0;  // 이미지 최대높이(px) 제한 (기본 제한 없음)
    var minHeight = (arg && arg.minHeight) ? arg.minHeight : 0;  // 이미지 최소높이(px) 제한 (기본 제한 없음)
    // 조건확인
    //console.log(maxNum + '/' + maxSize + '/' + permitExt + '/' + maxWidth + '/' + minWidth + '/' + maxHeight + '/' + minHeight);
    
    // 정보설정
    var inputName = this.attr('name').replace('[]', '');  // input 태그 name 값
    var inputId = this.attr('id');  // input 태그 id 값
    var inputNow = this;
    var inputCloned = this.clone(true);   // 최초 input 복제값(이벤트까지)
    var uiList = this.parent().find('ul.image-list');  // ul.image-list   div 필요?
    var htmlNoImage = '<li class="no-image">\
        <span class="image"><i class="fa fa-picture-o"></i></span>\
        <span class="filename"><i class="fa fa-exclamation-triangle"></i>No image</span>\
    </li>';
    var htmlUploading = '<li class="uploading">\
        <span class="image"><i class="fa fa-spinner fa-spin"></i></span>\
        <span class="filename"><i class="fa fa-spinner fa-spin"></i>Uploading...</span>\
    </li>';    
    var infoIcon = [];
    var infoFilename = [];
    var infoSize = [];
    var infoImageUrl = [];
    var infoWidth = [];
    var infoHeight = [];
    
    // 초기상태 (내용없으면 no-image 표시)
    if (uiList.find('li').length < 1) {
        uiList.append(htmlNoImage);
    }
    
    // 첨부 이벤트
    this.on('change', function(e) {
        var files = e.target.files;
        var numFiles = files.length;  // 선택된 파일수
        var numFilesPrev = uiList.find('li:not(.no-image, .uploading)').length;   // 이미 포함된 파일 수
        var numLoaded = 0;   // 로딩된 파일 수
        
        // 첨부된 내용이 없으면 취소, 있으면 no-image 제거 후 loading 표시
        if (numFiles < 1) return false;
        uiList.find('li.no-image').remove();
        uiList.append(htmlUploading);
        
        // 이미지 정보 읽기
        for (var i = 0; i < numFiles; i++) {
            readImageInfo(files[i], i);
        }
        
        // 이미지 정보 읽기 함수
        function readImageInfo(file, i) {
            infoIcon[i] = findFileIcon(file.name);
            infoFilename[i] = file.name;
            infoSize[i] = (file.size / 1024).toFixed(0);
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function() {  // 로딩이 완료되는 순서가 파일마다 다름
                numLoaded++;  // 로딩된 파일 수 카운드
                infoImageUrl[i] = this.result;
                var image = new Image();
                image.src = infoImageUrl[i];
                infoWidth[i] = image.width;
                infoHeight[i] = image.height;
                if (numLoaded === numFiles) {  // 마지막 로딩된 파일이면
                    var checkResult = checkValidation();
                    if (checkResult === 'true') {  // 모든 조건 만족시
                        attachImage();
                        inputNow.after(inputCloned);  // 빈 input으로 교체 / this로 하면 [object]만 표시
                        inputNow.next().imageAttach(arg);  //  신규 input에 같은 조건으로 이벤트 부여
                        inputNow.css({'display': 'none'});
                    } else {  // 조건 불만족
                        alert(checkResult);
                        // 로딩바 삭제 후 첨부내역 없으면 no-image 표시
                        uiList.find('li.uploading').remove();
                        if (uiList.find('li:not(.no-image, .uploading)').length === 0) {
                            uiList.append(htmlNoImage);
                        }
                        inputNow.after(inputCloned);  // 빈 input으로 교체 / this로 하면 [object]만 표시
                        inputNow.next().imageAttach(arg);  //  신규 input에 같은 조건으로 이벤트 부여
                        inputNow.remove();
                    }
                }
            };
        }
        
        function checkValidation() {
            var numFilesPrev = uiList.find('li:not(.no-image, .uploading)').length;   // 이미 포함된 파일 수
            var errorMsg = 'true';
            
            // 첨부파일 갯수제한 확인
            if (maxNum === 1 && numFiles > 1) {  // 1개만 첨부되는 경우에는 현재 파일만 검사(기존 파일 대체)
                errorMsg = '이미지는 ' + maxNum + '개만 첨부할 수 있습니다.';
                return errorMsg;
            }
            if ((numFiles + numFilesPrev) > maxNum && maxNum > 1) {  // maxNum : 0 무제한, maxNum : 1 --> 1개첨부용 UI (제외)
                errorMsg = '이미지는 최대 ' + maxNum + '개 까지만 첨부할 수 있습니다.';
                return errorMsg;
            }
            
            // 개별 파일별 조건 확인
            for (var i = 0; i < numFiles; i++) {
                // 용량확인
                if (infoSize[i] > maxSize && maxSize !== 0) {
                    errorMsg = '이미지 파일의 용량은 ' + numberWithCommas(maxSize) + 'KB 이하 까지만 첨부할 수 있습니다. 해당 용량을 초과하는 파일이 존재합니다.';
                    return errorMsg;
                }
                var fileExt = infoFilename[i].slice(infoFilename[i].lastIndexOf(".") + 1).toLowerCase();
                // 확장자 확인
                if (inArray(fileExt, permitExt) === -1) {
                    errorMsg = '첨부할 수 없는 형식의 파일이 존재합니다. 파일 확장자를 확인해 주세요.';
                    return errorMsg;
                }
                // 이미지 크기 확인
                if (infoWidth[i] > maxWidth && maxWidth !== 0) {
                    errorMsg = '이미지 크기를 확인해 주세요. 첨부가능한 이미지의 최대폭은 ' + maxWidth + 'px 입니다. (첨부된 이미지의 폭 : ' + infoWidth[i] + ' px)';
                    return errorMsg;
                }
                if (infoWidth[i] < minWidth && minWidth !== 0) {
                    errorMsg = '이미지 크기를 확인해 주세요. 첨부가능한 이미지의 최소폭은 ' + minWidth + 'px 입니다. (첨부된 이미지의 폭 : ' + infoWidth[i] + ' px)';
                    return errorMsg;
                }
                if (infoHeight[i] > maxHeight && maxHeight !== 0) {
                    errorMsg = '이미지 크기를 확인해 주세요. 첨부가능한 이미지의 최대높이은 ' + maxHeight + 'px 입니다. (첨부된 이미지의 높이 : ' + infoHeight[i] + ' px)';
                    return errorMsg;
                }
                if (infoHeight[i] < minHeight && minHeight !== 0) {
                    errorMsg = '이미지 크기를 확인해 주세요. 첨부가능한 이미지의 최소높이는 ' + minHeight + 'px 입니다. (첨부된 이미지의 높이 : ' + infoHeight[i] + ' px)';
                    return errorMsg;
                }
            }
            return errorMsg;   // 오류가 없으면 'true' 반환
        }
        
        function attachImage() {
            var imageListHtml = '';
            if (maxNum === 1) numFilesPrev = 0;
            for (var i = 0; i < numFiles; i++) {
                imageListHtml += '<li>\
                    <span class="image"><img alt="" src="' + infoImageUrl[i] + '" /><span class="dimension">' + infoWidth[i] + 'px X ' + infoHeight[i] + 'px</span></span>\
                    <span class="filename" title="' + infoFilename[i] + '"><img alt="" src="' + infoIcon[i] + '" />' + infoFilename[i] + '</span>\
                    <span class="size">' + numberWithCommas(infoSize[i]) + 'KB</span>\
                    <a href="#" class="delete" title="첨부삭제"><i class="fa fa-times"></i></a>\
                    <a href="#" class="prev" title="첨부순서 앞으로"><i class="fa fa-arrow-left"></i></a>\
                    <a href="#" class="next" title="첨부순서 뒤로"><i class="fa fa-arrow-right"></i></a>\
                    <a href="#" class="download" title="이미지 다운로드"><i class="fa fa-download"></i></a>\
                    <input type="hidden" name="' + inputName + 'InputSeq[]" class="input-seq" value="' + (numFilesPrev + i + 1)  + '" />\
                    <input type="hidden" name="' + inputName + 'Order[]" class="order" value="' + (numFilesPrev + i + 1)  + '" />\
                </li>';
            }
            uiList.find('li.no-image, li.uploading').remove();
            if (maxNum === 1) {
                uiList.html(imageListHtml);   // 1개만 첨부되는 경우에는 바로 대체
            } else {
                uiList.append(imageListHtml);   // 2개 이상이면 추가
            }
        }
    });
    
    // 순서 이동 / 삭제 기능
    uiList.off('click');
    uiList.on('click', 'a.prev', function(e) {
        e.preventDefault();
        var index = uiList.find('li').index($(this).parent()) + 1;
        if (index === 1) {
            alert('가장 앞에 있는 파일입니다.');
            return false;
        }
        var selectedList = $(this).parent().clone(true);
        $(this).parent().prev().before(selectedList);
        $(this).parent().remove();
        arrangeOrder();
    });
    uiList.on('click', 'a.next', function(e) {
        e.preventDefault();
        var numList = uiList.find('li').length;
        var index = uiList.find('li').index($(this).parent()) + 1;
        if (index === numList) {
            alert('가장 뒤에 있는 파일입니다.');
            return false;
        }
        var selectedList = $(this).parent().clone(true);
        $(this).parent().next().after(selectedList);
        $(this).parent().remove();
        arrangeOrder();
    });
    uiList.on('click', 'a.delete', function(e) {
        e.preventDefault();
        $(this).parent().remove();
        arrangeOrder();
        if (uiList.find('li:not(.no-file, .uploading)').length === 0) {
            uiList.append(htmlNoImage);
        }
    });
    // 첨부 이미지 순서 재정렬
    function arrangeOrder() {
        uiList.find('li').each(function(i) {
            var order = i + 1;
            $(this).find("input.order").val(order);
        });
    }
}


$.fn.fileAttach = function(arg) {
    'use strict';
    
    // 유효성 검사 조건 (0 : 제한없음 / 외부파라미터 전달)
    var maxNum = (arg && arg.maxNum) ? arg.maxNum : 0;   // 첨부파일 갯수 제한 (기본 제한 없음)
    var maxSize = (arg && arg.maxSize) ? arg.maxSize : 20000;   // 첨부파일(개별) 용량 제한 (기본 20,000 KB)
    var permitExt = (arg && arg.permitExt) ? arg.permitExt : ['jpg', 'png', 'gif', 'hwp', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'ai', 'psd', 'zip', 'egg', 'mov', 'avi', 'mp4', 'ogg', 'mp3', 'flv', 'swf', 'pdf', 'txt'];   // 첨부허용된 확장자
    
    // 정보설정
    var inputName = this.attr('name').replace('[]', '');  // input 태그 name 값
    var inputId = this.attr('id');  // input 태그 id 값
    var inputNow = this;
    var inputCloned = this.clone(true);   // 최초 input 복제값(이벤트까지)
    var uiList = this.parent().find('ul.file-list');  // ul.file-list   div 필요?
    var htmlNoFile = '<li class="no-file">\
        <span class="filename"><i class="fa fa-exclamation-triangle"></i>No file</span>\
    </li>';
    var htmlUploading = '<li class="uploading">\
        <span class="filename"><i class="fa fa-spinner fa-spin"></i>Uploading...</span>\
    </li>';
    var infoIcon = [];
    var infoFilename = [];
    var infoSize = [];
    
    // 초기상태 (내용없으면 no-image 표시)
    if (uiList.find('li').length < 1) {
        uiList.append(htmlNoFile);
    }
    
    // 첨부 이벤트
    this.on('change', function(e) {
        var files = e.target.files;
        var numFiles = files.length;  // 선택된 파일수
        var numFilesPrev = uiList.find('li:not(.no-file, .uploading)').length;   // 이미 포함된 파일 수
        
        // 첨부된 내용이 없으면 취소, 있으면 no-image 제거 후 loading 표시
        if (numFiles < 1) return false;
        uiList.find('li.no-file').remove();
        uiList.append(htmlUploading);
        
        // 파일 정보 읽기
        for (var i = 0; i < numFiles; i++) {
            readFileInfo(files[i], i);
        }
        
        // 파일 정보 읽기 함수
        function readFileInfo(file, i) {
            infoIcon[i] = findFileIcon(file.name);
            infoFilename[i] = file.name;
            infoSize[i] = (file.size / 1024).toFixed(0);
            if ((i + 1) === numFiles) {
                var checkResult = checkValidation();
                if (checkResult === 'true') {  // 모든 조건 만족시
                    attachFile();
                    inputNow.after(inputCloned);  // 빈 input으로 교체 / this로 하면 [object]만 표시
                    inputNow.next().fileAttach(arg);  //  신규 input에 같은 조건으로 이벤트 부여
                    inputNow.css({'display': 'none'});
                } else {  // 조건 불만족
                    alert(checkResult);
                    // 로딩바 삭제 후 첨부내역 없으면 no-image 표시
                    uiList.find('li.uploading').remove();
                    if (uiList.find('li:not(.no-file, .uploading)').length === 0) {
                        uiList.append(htmlNoFile);
                    }
                    inputNow.after(inputCloned);  // 빈 input으로 교체 / this로 하면 [object]만 표시
                    inputNow.next().fileAttach(arg);  //  신규 input에 같은 조건으로 이벤트 부여
                    inputNow.remove();
                }
            }
        }
        
        function checkValidation() {
            var numFilesPrev = uiList.find('li:not(.no-file, .uploading)').length;   // 이미 포함된 파일 수
            var errorMsg = 'true';
            
            // 첨부파일 갯수제한 확인
            if (maxNum === 1 && numFiles > 1) {  // 1개만 첨부되는 경우에는 현재 파일만 검사(기존 파일 대체)
                errorMsg = '첨부파일은 ' + maxNum + '개만 첨부할 수 있습니다.';
                return errorMsg;
            }
            if ((numFiles + numFilesPrev) > maxNum && maxNum > 1) {  // maxNum : 0 무제한, maxNum : 1 --> 1개첨부용 UI (제외)
                errorMsg = '첨부파일은 최대 ' + maxNum + '개 까지만 첨부할 수 있습니다.';
                return errorMsg;
            }
            
            // 개별 파일별 조건 확인
            for (var i = 0; i < numFiles; i++) {
                // 용량확인
                if (infoSize[i] > maxSize && maxSize !== 0) {
                    errorMsg = '첨부파일의 용량은 ' + numberWithCommas(maxSize) + 'KB 이하 까지만 첨부할 수 있습니다. 해당 용량을 초과하는 파일이 존재합니다.';
                    return errorMsg;
                }
                var fileExt = infoFilename[i].slice(infoFilename[i].lastIndexOf(".") + 1).toLowerCase();
                // 확장자 확인
                if (inArray(fileExt, permitExt) === -1) {
                    errorMsg = '첨부할 수 없는 형식의 파일이 존재합니다. 파일 확장자를 확인해 주세요.';
                    return errorMsg;
                }
            }
            return errorMsg;   // 오류가 없으면 'true' 반환
        }
        
        function attachFile() {
            var fileListHtml = '';
            if (maxNum === 1) numFilesPrev = 0;
            for (var i = 0; i < numFiles; i++) {
                fileListHtml += '<li>\
                    <a href="#" class="filename" title="' + infoFilename[i] + '"><img alt="" src="' + infoIcon[i] + '" />' + infoFilename[i] + '</a>\
                    <span class="size">' + numberWithCommas(infoSize[i]) + 'KB</span>\
                    <a href="#" class="delete" title="첨부삭제"><i class="fa fa-times"></i></a>\
                    <a href="#" class="prev" title="첨부순서 앞으로"><i class="fa fa-arrow-up"></i></a>\
                    <a href="#" class="next" title="첨부순서 뒤로"><i class="fa fa-arrow-down"></i></a>\
                    <input type="hidden" name="' + inputName + 'InputSeq[]" class="input-seq" value="' + (numFilesPrev + i + 1)  + '" />\
                    <input type="hidden" name="' + inputName + 'Order[]" class="order" value="' + (numFilesPrev + i + 1)  + '" />\
                </li>';
            }
            uiList.find('li.no-file, li.uploading').remove();
            if (maxNum === 1) {
                uiList.html(fileListHtml);   // 1개만 첨부되는 경우에는 바로 대체
            } else {
                uiList.append(fileListHtml);   // 2개 이상이면 추가
            }
        }
    });
    
    // 순서 이동 / 삭제 기능
    uiList.off('click');
    uiList.on('click', 'a.prev', function(e) {
        e.preventDefault();
        var index = uiList.find('li').index($(this).parent()) + 1;
        if (index === 1) {
            alert('가장 앞에 있는 파일입니다.');
            return false;
        }
        var selectedList = $(this).parent().clone(true);
        $(this).parent().prev().before(selectedList);
        $(this).parent().remove();
        arrangeOrder();
    });
    uiList.on('click', 'a.next', function(e) {
        e.preventDefault();
        var numList = uiList.find('li').length;
        var index = uiList.find('li').index($(this).parent()) + 1;
        if (index === numList) {
            alert('가장 뒤에 있는 파일입니다.');
            return false;
        }
        var selectedList = $(this).parent().clone(true);
        $(this).parent().next().after(selectedList);
        $(this).parent().remove();
        arrangeOrder();
    });
    uiList.on('click', 'a.delete', function(e) {
        e.preventDefault();
        $(this).parent().remove();
        arrangeOrder();
        if (uiList.find('li:not(.no-file, .uploading)').length === 0) {
            uiList.append(htmlNoFile);
        }
    });
    // 첨부 이미지 순서 재정렬
    function arrangeOrder() {
        uiList.find('li').each(function(i) {
            var order = i + 1;
            $(this).find("input.order").val(order);
        });
    }
}

function findFileIcon(filename) {
    var fileExt = filename.slice(filename.lastIndexOf(".") + 1).toLowerCase();
    var iconPath = '../img/common/';
    var iconName = '';
    switch(fileExt) {
        case 'ico' :
        case 'jpg' :
        case 'png' :
        case 'gif' : iconName = 'icon_img.png'; break;
        case 'hwp' : iconName = 'icon_hwp.png'; break;
        case 'xls' :
        case 'xlsx' : iconName = 'icon_excel.png'; break;
        case 'doc' :
        case 'docx' : iconName = 'icon_word.png'; break;
        case 'ppt' :
        case 'pptx' : iconName = 'icon_ppt.png'; break;
        case 'ai' : iconName = 'icon_ai.png'; break;
        case 'psd' : iconName = 'icon_psd.png'; break;
        case 'swf' :
        case 'flv' : iconName = 'icon_flash.png'; break;
        case 'avi' :
        case 'ogg' :
        case 'mp4' :
        case 'mov' : iconName = 'icon_mov.png'; break;
        case 'mp3' : iconName = 'icon_mp3.png'; break;
        case 'pdf' : iconName = 'icon_pdf.png'; break;
        case 'txt' : iconName = 'icon_txt.png'; break;
        case 'zip' :
        case 'egg' : iconName = 'icon_zip.png'; break;
        default : iconName = 'icon_file.png';
    }
    return iconPath + iconName;
}


// 특정 요소가 배열 내 존재하는지 검사(데이터 타입까지 일치하는지 확인)
function inArray(el, arr) {
    var result = -1;
    for (var i = 0; i < arr.length; i++) {
        if (el === arr[i]) return i;
    }
    return result;
}

// 천단위 콤마 표시(문자열)
function numberWithCommas(num) {
    var parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}




