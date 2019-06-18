// JavaScript Document
'use strict';

// 기본설정정보(이미지, 파일첨부에 대한 기본 설정값 / 미설정시 아래의 값 적용 / 단위 MB)
var fileConfig = {
    maxImageNum: 0,
    maxImageSize: 5,
    permitImageExt: ['jpg', 'png', 'gif'],
    maxImageWidth: 0,
    minImageWidth: 0,
    maxImageHeight: 0,
    minImageHeight: 0,
    imageUploadPath: '',
    imageFunctionPath: '/admin/program/common/image_upload.php',
    maxFileNum: 0,
    maxFileSize: 20,
    permitFileExt: ['jpg', 'png', 'gif', 'hwp', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'ai', 'psd', 'zip', 'egg', 'mov', 'avi', 'mp4', 'ogg', 'mp3', 'flv', 'swf', 'pdf', 'txt'],
    fileUploadPath: '',
    fileFunctionPath: '/admin/program/common/file_upload.php'
}

// 이미지 첨부
// 사용예시 $('#image1').imageAttach({maxNum: 1, maxSize: 2000, ...});
// IE10 이상에서만 동작 (IE 10에서는 input 초기화 안됨 / IE9 이하 미동작(e.target 미인식))
$.fn.imageAttach = function(arg) {
    
    // 기능설정정보(parameter 전달 가능)
    var maxNum = (arg !== undefined && arg.maxNum !== undefined) ? arg.maxNum : fileConfig.maxImageNum;  // 첨부이미지 개수 제한 (기본 : 제한없음)
    var maxSize = (arg !== undefined && arg.maxSize !== undefined) ? arg.maxSize : fileConfig.maxImageSize; // 첨부이미지 용량 제한(2MB) (기본 : 2MB)
    var permitExt = (arg !== undefined && arg.permitExt !== undefined) ? arg.permitExt : fileConfig.permitImageExt;   // 첨부허용된 확장자 (기본 jpg, png, gif)
    var permitExtList = permitExt.join(', ');
    var maxWidth = (arg !== undefined && arg.maxWidth !== undefined) ? arg.maxWidth : fileConfig.maxImageWidth;    // 이미지 최대폭(px) 제한 (기본 제한 없음)
    var minWidth = (arg !== undefined && arg.minWidth !== undefined) ? arg.minWidth : fileConfig.minImageWidth;    // 이미지 최소폭(px) 제한 (기본 제한 없음)
    var maxHeight = (arg !== undefined && arg.maxHeight !== undefined) ? arg.maxHeight : fileConfig.maxImageHeight;  // 이미지 최대높이(px) 제한 (기본 제한 없음)
    var minHeight = (arg !== undefined && arg.minHeight !== undefined) ? arg.minHeight : fileConfig.minImageHeight;  // 이미지 최소높이(px) 제한 (기본 제한 없음)
    var uploadPath = (arg !== undefined && arg.uploadPath !== undefined) ? arg.uploadPath : fileConfig.imageUploadPath;  // 이미지 최소높이(px) 제한 (기본 제한 없음)
    var functionPath = (arg !== undefined && arg.functionPath !== undefined) ? arg.functionPath : fileConfig.imageFunctionPath;  // 이미지 최소높이(px) 제한 (기본 제한 없음)
    //console.log(maxNum + ' / ' + maxSize + ' / ' + permitExtList + ' / ' + maxWidth + ' / ' + minWidth + ' / ' + maxHeight + ' / ' + minHeight + ' / ' + uploadPath);
    
    // 기본정보
    var htmlNoImage = '\n';
        htmlNoImage += '<li class="no-image">\n';
        htmlNoImage += '    <span class="image"><span class="fontawesome"><i class="far fa-image"></i></span></span>\n';
        htmlNoImage += '    <span class="fileinfo">\n';
        htmlNoImage += '        <span class="fontawesome"><i class="fas fa-exclamation-triangle"></i></span>\n';
        htmlNoImage += '        <em class="name">No image</em>\n';
        htmlNoImage += '    </span>\n';
        htmlNoImage += '</li>\n';
    var htmlUploading = '\n';
        htmlUploading += '<li class="uploading">\n';
        htmlUploading += '    <span class="image"><span class="fontawesome"><i class="fas fa-spinner fa-spin"></i><span></span>\n';
        htmlUploading += '    <span class="fileinfo">\n';
        htmlUploading += '        <span class="fontawesome"><i class="fas fa-spinner fa-spin"></i></span>\n';
        htmlUploading += '        <em class="name">Uploading...</em>\n';
        htmlUploading += '    </span>\n';
        htmlUploading += '</li>\n';
    
    // 초기화 (등록화면 / 수정화면은 php 초기상태 표시)
    if (this.parent().find('ul.image-preview > li').length === 0) {
        this.wrap('<div class="image-attachment"></div>');
        this.before('<ul class="image-preview"></ul>');
        this.parent().find('ul.image-preview').html(htmlNoImage);
    }
    
    // 파일첨부 이벤트
    this.on('change', function(e) {
        if ($(this).val() === '') return false;
        
        var inputElement = $(this);
        var infoPreNum = $(this).prev().find(' > li:not(.no-image, .uploading)').length;  // 기존에 첨부된 이미지 수
        var infoNum = 0;   // 현재 첨부된 이미지 수
        var infoTotalNum = 0;
        var infoNumNotImage = 0;  // 허용되지 않은 확장자의 파일의 수 (image.onload 기능 관련 검사용)
        var infoInputName = $(this).attr('name');  // image1[] 형태인 경우에 []를 제외해야 함
        var infoInputNameNoBracket = $(this).attr('name').replace('[]', '');
        var infoSize = 0;
        var infoFileName = '';
        var infoExt = '';
        var infoWidth = 0;
        var infoHeight = 0;
        var infoIndex = 0;  // 첨부된 개별 파일 index
        var files = e.target.files;   // IE 10 이상에서만 동작 (IE9 이하에서 오류)
        var resultValidation = 'success';
        var errorMsg = '';
        
        // 첨부파일 수 제한 확인
        infoNum = files.length;
        infoTotalNum = infoPreNum + infoNum;  // 선택된 파일수 (기존 첨부할 파일 수에 더해서 계산)
        if (maxNum !== 0 && infoTotalNum > maxNum) {   // 0이면 제한 없음
            resultValidation = 'fail';
            errorMsg += '이미지 파일은 ' + maxNum + '개 까지만 첨부가능합니다\n';
        }
        
        // 개별 파일별로 호출(검사)
        if (files) {
            [].forEach.call(files, readAndCheck);
        }
        
        function readAndCheck(file) {
            infoFileName = file.name;
            infoSize = (file.size / 1024 / 1024).toFixed(2);  //(MB로 환산)
            if (infoSize !== 0 && infoSize > maxSize) {  // 0이면 제한 없음
                resultValidation = 'fail';
                errorMsg += '첨부이미지 허용용량(' + maxSize + 'MB)이 초과된 이미지가 있습니다. [파일명 : ' + infoFileName + ' (첨부된 이미지 용량 : ' + infoSize + 'MB)]\n';
            }
            infoExt = infoFileName.slice(infoFileName.lastIndexOf(".") + 1).toLowerCase();
            if (checkInArray(infoExt, permitExt) === -1) {    // checkInArray() : dino_library.js에 정의
                resultValidation = 'fail';
                errorMsg += '허용되지 않은 확장자의 이미지가 있습니다. (첨부가능 확장자 : ' + permitExtList + ') [파일명 : ' + infoFileName + ']\n';
                infoNumNotImage++;
            }
            
            var reader = new FileReader();
            reader.addEventListener('load', function () {
                var image = new Image();
                image.src = this.result;
                image.onload = function() {  // 첨부된 파일이 이미지인 경우에만 실행됨
                    infoFileName = file.name;  // 실행시점이 달라서 다시 업데이트 해야함
                    infoWidth = image.width;
                    infoHeight = image.height;
                    if ((maxWidth > 0 && infoWidth > maxWidth) || (minWidth > 0 && infoWidth < minWidth)) {  // 0이하 이면 제한 없음
                        resultValidation = 'fail';
                        errorMsg += '허용 가능한 이미지 폭(' + minWidth + 'px ~ ' + maxWidth + 'px)을 벗어난 첨부이미지가 있습니다. [파일명 : ' + infoFileName + ' (첨부이미지 폭 ' + infoWidth + 'px)]\n';
                    }
                    if ((maxHeight > 0 && infoHeight > maxHeight) || (minHeight > 0 && infoHeight < minHeight)) {  // 0이하 이면 제한 없음
                        resultValidation = 'fail';
                        errorMsg += '허용 가능한 이미지 높이(' + minHeight + 'px ~ ' + maxHeight + 'px)를 벗어난 첨부이미지가 있습니다. [파일명 : ' + infoFileName + ' (첨부이미지 높이 ' + infoHeight + 'px)]\n';
                    }
                    
                    infoIndex++;
                    if (infoIndex === infoNum) {  // 1 : 첨부파일이 모두 이미지이고, 마지막 이미지를 읽은 후에 실행 (이미지 사이즈 확인)
                        executeAttach();
                    }
                }
            });
            reader.readAsDataURL(file);
        }
        
        if (infoNumNotImage > 0) { // 2 : 기타의 모든 경우에 실행(미허용 확장자 파일이 첨부된 경우)
            executeAttach();
        }
        
        function executeAttach() {
            // 결과
            if (resultValidation === 'success') {
                fileUpload();
            } else {
                alert(errorMsg);
            }
            inputElement.val('');  // IE11 이상에서만 동작
        }
        
        function fileUpload() {
            var form_data = new FormData();
            for (var i = 0; i < files.length; i++) {
                form_data.append(infoInputName, files[i]);   // name값이 image1[] 인 경우 image1[] 전달되어야 함
            }
            form_data.append('inputName', infoInputNameNoBracket);    // name값이 image1[] 경우 $_POST['image1']로 전달되어야 함
            form_data.append('preNum', infoPreNum);
            form_data.append('maxNum', maxNum);
            form_data.append('maxSize', maxSize);
            form_data.append('permitExtList', permitExtList);
            form_data.append('maxWidth', maxWidth);
            form_data.append('minWidth', minWidth);
            form_data.append('maxHeight', maxHeight);
            form_data.append('minHeight', minHeight);
            form_data.append('uploadPath', uploadPath);
            
            $.ajax({
                url: functionPath,
                dataType: 'json',
                cache: false,
                contentType: false,
                processData: false,
                data: form_data,
                type: 'post',
                beforeSend: function(xhr, settings) {
                    displayUploading();
                },
                success: function(data, status, xhr) {
                    displayImagePreview(data);
                },
                error: function(xhr, status, errorThrown) {
                    alert('이미지가 업로드되지 않았습니다. [' + status + ':' + errorThrown + ']');
                },
                complete: function(xhr, status) {
                    uploadComplete();
                }
            });
        }
        
        function displayUploading() {
            inputElement.parent().find('li.no-image, li.uploading').remove();
            inputElement.parent().find('ul.image-preview').append(htmlUploading);
        }
        
        function displayImagePreview(data) {
            // 업로드 실패시
            if (data.status === 'fail') {
                alert(data.message);
                return false;
            }
            // 업로드 파일 표시
            var numImage = data.images.length;
            var order = infoPreNum;
            for(var i = 0; i < numImage; i++) {
                order++;
                var hmtlImage = '\n';
                    hmtlImage += '<li>\n';
                    hmtlImage += '    <span class="image">\n';
                    hmtlImage += '        <img alt="" src="' + data.images[i].src + '" />\n';
                    hmtlImage += '        <span class="dimension">' + data.images[i].width + 'px X ' + data.images[i].height + 'px</span>\n';
                    hmtlImage += '        <a href="#" class="prev"><span class="fontawesome"><i class="fas fa-angle-left" title="앞으로 이동"></i></span></a>\n';
                    hmtlImage += '        <a href="#" class="next"><span class="fontawesome"><i class="fas fa-angle-right" title="뒤로 이동"></i><span></a>\n';
                    hmtlImage += '        <a href="' + data.images[i].src + '" target="_blank" class="download"><span class="fontawesome"><i class="fas fa-search-plus" title="원본사이즈로 보기"></i></span></a>\n';
                    hmtlImage += '    </span>\n';
                    hmtlImage += '    <span class="fileinfo" title="' + data.images[i].name + '">\n';
                    hmtlImage += '        <img alt="" src="/admin/img/common/' + data.images[i].icon + '" />\n';
                    hmtlImage += '        <em class="name">' + data.images[i].name + '</em>\n';
                    hmtlImage += '    </span>\n';
                    hmtlImage += '    <span class="size">' + data.images[i].size + 'MB</span>\n';
                    hmtlImage += '    <a href="#" class="delete"><span class="fontawesome"><i class="fas fa-times" title="첨부삭제"></i></span></a>\n';
                    hmtlImage += '    <input type="hidden" name="' + infoInputNameNoBracket + 'Id[]" value="' + data.images[i].id + '" />\n';
                    hmtlImage += '    <input type="hidden" name="' + infoInputNameNoBracket + 'Order[]" value="' + order + '" />\n';
                    hmtlImage += '    <input type="hidden" name="' + infoInputNameNoBracket + 'Type[]" value="insert" />\n';
                    hmtlImage += '</li>\n';
                inputElement.parent().find('li.no-image, li.uploading').remove();
                inputElement.parent().find('ul.image-preview').append(hmtlImage);
            }
        }
        
        function uploadComplete() {  // 첨부 후 (성공/오류발생시 모두) 동작
            inputElement.parent().find('li.no-image, li.uploading').remove();
            if (inputElement.prev().find(' > li:not(.no-image, .uploading)').length < 1) {
                inputElement.parent().find('ul.image-preview').append(htmlNoImage);
            }
        }
    });
    
    // 기능 (이동 및 삭제)
    $(this).parent().on('click', 'ul.image-preview a.prev', function() {
        var elementList = $(this).closest('ul');
        var index = elementList.find(' > li:not(.no-image, .uploading)').index($(this).closest('li')) + 1;
        if (index <= 1) {
            alert('가장 앞에 위치해 있습니다.');
        } else {
            $(this).closest('li').prev().before($(this).closest('li').clone(true));
            $(this).closest('li').remove();
            reArrangeList(elementList);
        }
    });
    $(this).parent().on('click', 'ul.image-preview a.next', function() {
        var elementList = $(this).closest('ul');
        var numList = elementList.find(' > li:not(.no-image, .uploading)').length;
        var index = elementList.find(' > li:not(.no-image, .uploading)').index($(this).closest('li')) + 1;
        if (index >= numList) {
            alert('가장 뒤에 위치해 있습니다.');
        } else {
            $(this).closest('li').next().after($(this).closest('li').clone(true));
            $(this).closest('li').remove();
            reArrangeList(elementList);
        }
    });
    $(this).parent().on('click', 'ul.image-preview a.delete', function() {
        var elementList = $(this).closest('ul');
        var numList = elementList.find(' > li:not(.no-image, .uploading)').length;
        if (numList <= 1) {
            $(this).closest('ul').html(htmlNoImage);
        }
        $(this).closest('li').remove();
        reArrangeList(elementList);
    });
    
    function reArrangeList(element) {
        element.find(' > li:not(.no-image, .uploading)').each(function(i) {
            $(this).find('input[type="hidden"]:eq(1)').val(i + 1);
        });
    }
}

// 파일첨부
$.fn.fileAttach = function(arg) {
    
    // 기능설정정보(parameter 전달 가능)
    var maxNum = (arg !== undefined && arg.maxNum !== undefined) ? arg.maxNum : fileConfig.maxFileNum;  // 첨부이미지 개수 제한 (기본 : 제한없음)
    var maxSize = (arg !== undefined && arg.maxSize !== undefined) ? arg.maxSize : fileConfig.maxFileSize; // 첨부이미지 용량 제한(2MB) (기본 : 2MB)
    var permitExt = (arg !== undefined && arg.permitExt !== undefined) ? arg.permitExt : fileConfig.permitFileExt;   // 첨부허용된 확장자 (기본 jpg, png, gif)
    var permitExtList = permitExt.join(', ');
    var uploadPath = (arg !== undefined && arg.uploadPath !== undefined) ? arg.uploadPath : fileConfig.fileUploadPath;  // 이미지 최소높이(px) 제한 (기본 제한 없음)
    var functionPath = (arg !== undefined && arg.functionPath !== undefined) ? arg.functionPath : fileConfig.fileFunctionPath;  // 이미지 최소높이(px) 제한 (기본 제한 없음)
    //console.log(maxNum + ' / ' + maxSize + ' / ' + permitExtList + ' / ' + maxWidth + ' / ' + minWidth + ' / ' + maxHeight + ' / ' + minHeight + ' / ' + uploadPath);
    
    // 기본정보
    var htmlNoFile = '\n';
        htmlNoFile += '<li class="no-file">\n';
        htmlNoFile += '    <span class="filename">\n';
        htmlNoFile += '        <span class="fontawesome"><i class="fas fa-exclamation-triangle"></i></span>\n';
        htmlNoFile += '        <em class="name">No File</em>\n';
        htmlNoFile += '    </span>\n';
        htmlNoFile += '</li>\n';
    var htmlUploading = '\n';
        htmlUploading += '<li class="uploading">\n';
        htmlUploading += '    <span class="filename">\n';
        htmlUploading += '        <span class="fontawesome"><i class="fas fa-spinner fa-spin"></i></span>\n';
        htmlUploading += '        <em class="name">Uploading...</em>\n';
        htmlUploading += '    </span>\n';
        htmlUploading += '</li>\n';
    
    // 초기화 (등록화면 / 수정화면은 php 초기상태 표시)
    if (this.parent().find('ul.file-preview > li').length === 0) {
        this.wrap('<div class="file-attachment"></div>');
        this.before('<ul class="file-preview"></ul>');
        this.parent().find('ul.file-preview').html(htmlNoFile);
    }
    
    // 파일첨부 이벤트
    this.on('change', function(e) {
        if ($(this).val() === '') return false;
        
        var inputElement = $(this);
        var infoPreNum = $(this).prev().find(' > li:not(.no-file, .uploading)').length;  // 기존에 첨부된 이미지 수
        var infoNum = 0;   // 현재 첨부된 이미지 수
        var infoTotalNum = 0;
        var infoInputName = $(this).attr('name');  // image1[] 형태인 경우에 []를 제외해야 함
        var infoInputNameNoBracket = $(this).attr('name').replace('[]', '');
        var infoSize = 0;
        var infoFileName = '';
        var infoExt = '';
        var files = e.target.files;   // IE 10 이상에서만 동작 (IE9 이하에서 오류)
        var resultValidation = 'success';
        var errorMsg = '';
        
        // 첨부파일 수 제한 확인
        infoNum = files.length;
        infoTotalNum = infoPreNum + infoNum;  // 선택된 파일수 (기존 첨부할 파일 수에 더해서 계산)
        if (maxNum !== 0 && infoTotalNum > maxNum) {   // 0이면 제한 없음
            resultValidation = 'fail';
            errorMsg += '파일은 ' + maxNum + '개 까지만 첨부가능합니다\n';
        }
        
        // 개별 파일별로 호출(검사)
        if (files) {
            [].forEach.call(files, readAndCheck);
        }
        
        function readAndCheck(file) {
            infoFileName = file.name;
            infoSize = (file.size / 1024 / 1024).toFixed(2);  //(MB로 환산)
            if (infoSize !== 0 && infoSize > maxSize) {  // 0이면 제한 없음
                resultValidation = 'fail';
                errorMsg += '첨부파일 허용용량(' + maxSize + 'MB)이 초과된 이미지가 있습니다. [파일명 : ' + infoFileName + ' (첨부된 이미지 용량 : ' + infoSize + 'MB)]\n';
            }
            infoExt = infoFileName.slice(infoFileName.lastIndexOf(".") + 1).toLowerCase();
            if (checkInArray(infoExt, permitExt) === -1) {    // checkInArray() : dino_library.js에 정의
                resultValidation = 'fail';
                errorMsg += '허용되지 않은 확장자의 파일이 있습니다. (첨부가능 확장자 : ' + permitExtList + ') [파일명 : ' + infoFileName + ']\n';
            }
        }
        
        executeAttach();
        
        function executeAttach() {
            // 결과
            if (resultValidation === 'fail') {
                alert(errorMsg);
            } else {
                fileUpload();
            }
            inputElement.val('');  // IE11 이상에서만 동작
        }
        
        function fileUpload() {
            var form_data = new FormData();
            for (var i = 0; i < files.length; i++) {
                form_data.append(infoInputName, files[i]);   // name값이 image1[] 인 경우 image1[] 전달되어야 함
            }
            form_data.append('inputName', infoInputNameNoBracket);    // name값이 image1[] 경우 $_POST['image1']로 전달되어야 함
            form_data.append('preNum', infoPreNum);
            form_data.append('maxNum', maxNum);
            form_data.append('maxSize', maxSize);
            form_data.append('permitExtList', permitExtList);
            form_data.append('uploadPath', uploadPath);
            
            $.ajax({
                url: functionPath,
                dataType: 'json',
                cache: false,
                contentType: false,
                processData: false,
                data: form_data,
                type: 'post',
                beforeSend: function(xhr, settings) {
                    displayUploading();
                },
                success: function(data, status, xhr) {
                    displayFilePreview(data);
                },
                error: function(xhr, status, errorThrown) {
                    alert('파일이 업로드되지 않았습니다. [' + status + ':' + errorThrown + ']');
                },
                complete: function(xhr, status) {
                    uploadComplete();
                }
            });
        }
        
        function displayUploading() {
            inputElement.parent().find('li.no-file, li.uploading').remove();
            inputElement.parent().find('ul.file-preview').append(htmlUploading);
        }
        
        function displayFilePreview(data) {
            // 업로드 실패시
            if (data.status === 'fail') {
                alert(data.message);
                return false;
            }
            // 업로드 파일 표시
            var numFile = data.files.length;
            var order = infoPreNum;
            for(var i = 0; i < numFile; i++) {
                order++;
                var htmlFile = '\n';
                    htmlFile += '<li>\n';
                    htmlFile += '    <a href="#" class="filename" title="' + data.files[i].name + '">\n';
                    htmlFile += '        <img alt="" src="/admin/img/common/' + data.files[i].icon + '" />\n';
                    htmlFile += '        <em class="name">' + data.files[i].name + '</em>\n';
                    htmlFile += '    </a>\n';
                    htmlFile += '    <p class="function">\n';
                    htmlFile += '        <a href="#" class="prev"><span class="fontawesome"><i class="fas fa-arrow-up" title="첨부순서 앞으로"></i></span></a>\n';
                    htmlFile += '        <a href="#" class="next"><span class="fontawesome"><i class="fas fa-arrow-down" title="첨부순서 앞으로"></i></span></a>\n';
                    htmlFile += '        <a href="#" class="delete"><span class="fontawesome"><i class="fas fa-times" title="첨부순서 앞으로"></i></span></a>\n';
                    htmlFile += '        <span class="size">' + data.files[i].size + 'MB</span>\n';
                    htmlFile += '    </p>\n';
                    htmlFile += '    <input type="hidden" name="' + infoInputNameNoBracket + 'Id[]" value="' + data.files[i].id + '" />\n';
                    htmlFile += '    <input type="hidden" name="' + infoInputNameNoBracket + 'Order[]" value="' + order + '" />\n';
                    htmlFile += '    <input type="hidden" name="' + infoInputNameNoBracket + 'Type[]" value="insert" />\n';
                    htmlFile += '</li>\n';
                inputElement.parent().find('li.no-file, li.uploading').remove();
                inputElement.parent().find('ul.file-preview').append(htmlFile);
            }
        }
        
        function uploadComplete() {  // 첨부 후 (성공/오류발생시 모두) 동작
            inputElement.parent().find('li.no-file, li.uploading').remove();
            if (inputElement.prev().find(' > li:not(.no-file, .uploading)').length < 1) {
                inputElement.parent().find('ul.file-preview').append(htmlNoFile);
            }
        }
    });
    
    // 기능 (이동 및 삭제)
    $(this).parent().on('click', 'ul.file-preview a.prev', function() {
        console.log('prev');
        var elementList = $(this).closest('ul');
        var index = elementList.find(' > li:not(.no-file, .uploading)').index($(this).closest('li')) + 1;
        if (index <= 1) {
            alert('가장 앞에 위치해 있습니다.');
        } else {
            $(this).closest('li').prev().before($(this).closest('li').clone(true));
            $(this).closest('li').remove();
            reArrangeList(elementList);
        }
    });
    $(this).parent().on('click', 'ul.file-preview a.next', function() {
        var elementList = $(this).closest('ul');
        var numList = elementList.find(' > li:not(.no-file, .uploading)').length;
        var index = elementList.find(' > li:not(.no-file, .uploading)').index($(this).closest('li')) + 1;
        if (index >= numList) {
            alert('가장 뒤에 위치해 있습니다.');
        } else {
            $(this).closest('li').next().after($(this).closest('li').clone(true));
            $(this).closest('li').remove();
            reArrangeList(elementList);
        }
    });
    $(this).parent().on('click', 'ul.file-preview a.delete', function() {
        var elementList = $(this).closest('ul');
        var numList = elementList.find(' > li:not(.no-file, .uploading)').length;
        if (numList <= 1) {
            $(this).closest('ul').html(htmlNoFile);
        }
        $(this).closest('li').remove();
        reArrangeList(elementList);
    });
    
    function reArrangeList(element) {
        element.find(' > li:not(.no-file, .uploading)').each(function(i) {
            $(this).find('input[type="hidden"]:eq(1)').val(i + 1);
        });
    }
}




// calendar UI
function applyAirCalendar(selector) {
    // 캘린더 버튼 동작
    $(selector).next().on('click', function() {
        if ($(this).attr('class').indexOf('btn') !== -1) {  // btn class가 존재하면
            $(this).prev().focus();
        }
    });
    
    // 형태(날짜, 월, 연도, 시간)별 세팅
    $(selector).each(function() {
        switch ($(this).attr('class')) {
            case 'date':
                $(this).attr({'maxlength': 10});
                break;
            case 'month':
                $(this).attr({'maxlength': 7, 'data-min-view': 'months', 'data-view': 'months', 'data-date-format': 'yyyy-mm'});
                break;
            case 'year':
                $(this).attr({'maxlength': 4, 'data-min-view': 'years', 'data-view': 'years', 'data-date-format': 'yyyy'});
                break;
            case 'datetime':
                $(this).attr({'maxlength': 16, 'data-timepicker': 'true', 'data-time-format': 'hh:ii'});
                break;
            case 'datehour':
                $(this).attr({'maxlength': 16, 'data-timepicker': 'true', 'data-time-format': 'hh:00'});
                break;
        }
    });
    
    // air-datepicker 적용
    var date = new Date();
    $('input.date, input.month, input.year, input.datetime, input.datehour').datepicker({
        language: 'ko',
        autoClose: true,
        startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate(), '00', '00'),  // 시간, 분은 00으로 초기 설정
        minutesStep: 5    // 분 단위
        //minDate: new Date()
    });
    
    // 자동포맷 적용
    autoFormatDateTime('input.date, input.month, input.year, input.datetime');
    
    function autoFormatDateTime(selector) {
        // 이벤트(포맷 자동변경)
        $(selector).on('keyup', function(e) {
            // backspace이면 동작하지 않음(수정시)
            if (e.keyCode === 8) return false;

            var maxLength = Number($(this).attr('maxlength'));
            var text = $(this).val();
            var pattern = /[^\d]/g;  // 입력허용값(숫자만)
            var newText = text.replace(pattern, '');  // 숫자이외의 기호는 없앰
            var newTextLength = newText.length;
            // Dash 자동 삽입
            if (newTextLength > 4) {
                newText = newText.slice(0, 4) + '-' + newText.slice(4);
            }
            if (newTextLength > 6){
                newText = newText.slice(0, 7) + '-' + newText.slice(7);
            }
            if (newTextLength > 8){
                newText = newText.slice(0, 10) + ' ' + newText.slice(10);
            }
            if (newTextLength > 10){
                newText = newText.slice(0, 13) + ':' + newText.slice(13);
            }
            // 최대값을 넘는 경우 삭제
            if (newText.length > maxLength) {
                newText = newText.slice(0, maxLength);
            }
            // 반영
            $(this).val(newText);  // 현재 요소만
        });
    }
}

// 다음 주소 API
function execDaumPostcode(idZip, idAddress1, idAddress2) {
    new daum.Postcode({
        oncomplete: function(data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 각 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var fullAddr = ''; // 최종 주소 변수
            var fullAddrEnglish = ''; // 최종 주소 변수(영문)
            var extraAddr = ''; // 조합형 주소 변수

            //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                fullAddr = data.roadAddress;
                fullAddrEnglish = data.roadAddressEnglish;
            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                fullAddr = data.jibunAddress;
                fullAddrEnglish = data.jibunAddressEnglish;
            }

            // 사용자가 선택한 주소가 도로명 타입일때 조합한다.
            if(data.userSelectedType === 'R'){
                //법정동명이 있을 경우 추가한다.
                if(data.bname !== ''){
                    extraAddr += data.bname;
                }
                // 건물명이 있을 경우 추가한다.
                if(data.buildingName !== ''){
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                // 조합형주소의 유무에 따라 양쪽에 괄호를 추가하여 최종 주소를 만든다.
                fullAddr += (extraAddr !== '' ? ' ('+ extraAddr +')' : '');
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            document.getElementById(idZip).value = data.zonecode;
            //document.getElementById('zip-old1').value = data.postcode1;   // 구 우편번호 앞자리
            //document.getElementById('zip-old2').value = data.postcode2;   // 구 우편번호 뒷자리
            document.getElementById(idAddress1).value = fullAddr;
            //document.getElementById("address3").value = fullAddrEnglish;  //영문주소(공통)
            // 커서를 상세주소 필드로 이동한다.
            document.getElementById(idAddress2).focus();
        }
    }).open();
}

// CK Editor 4 적용
function applyCKEditor(id) {
    var editor = CKEDITOR.replace(id, {
        language: 'ko',
        height: 400,
        //contentsCss: "/admin/library/ckeditor/contents.css",
        filebrowserUploadUrl: "/admin/program/common/ckeditor_image_upload.php",
        customConfig: '/admin/library/ckeditor/config_custom.js'
    });
    // 내용 작성시 마다 From(Textarea에 내용 반영)
    editor.on('change', function(e) {
        var editorData = editor.getData();
        $('#' + id).val(editorData);
        //console.log( 'Total bytes: ' + editorData );
    });
}

// Form 정보 제출(File 제외)
$.fn.ajaxSendFormData = function(arg) {
    var formName = '';
    if (arg !== undefined && arg.formName !== undefined) {
        formName = arg.formName;
    } else {
        alert('formName 속성이 정의되지 않았습니다.');
        return false;
    }
    var targetUrl = '';
    if (arg !== undefined && arg.targetUrl !== undefined) {
        targetUrl = arg.targetUrl;
    } else {
        alert('targetUrl 속성이 정의되지 않았습니다.');
        return false;
    }
    var moveUrl = '';
    if (arg !== undefined && arg.moveUrl !== undefined) {
        moveUrl = arg.moveUrl;
    } else {
        alert('moveUrl 속성이 정의되지 않았습니다.');
        return false;
    }
    var msgSuccess = (arg !== undefined && arg.msgSuccess !== undefined) ? arg.msgSuccess : '정보가 정상적으로 등록되었습니다.';
    var msgFail = (arg !== undefined && arg.msgFail !== undefined) ? arg.msgFail : '정보가 정상적으로 등록되지 않았습니다.';
    
    this.on('click', function() {
        var isExecute = false;
        if (arg !== undefined && arg.msgConfirm !== undefined) {  // 정의되어 있으면
            if (confirm(arg.msgConfirm)) {
                isExecute = true;    // 확인 누르면 실행
            }
        } else {
            isExecute = true;   // 정의되지 않으면 바로 실행
        }
        if (isExecute === false) return false;
        
        var params = $('form[name="' + formName + '"]').serialize();
        $.ajax({
            url: targetUrl,
            type: 'post',
            data: params,
            processData: false,
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            dataType: 'json',
            cache: false,
            beforeSend: function(xhr, settings) {
                //validateFormData(params, xhr, settings);
            },
            success: function(data, status, xhr) {
                if (data.status === 'success') {
                    alert(msgSuccess);
                    location.href = moveUrl;
                } else if (data.status === 'fail') {
                    executeFail(data);
                } else {
                    alert('Test 확인 값 : \n' + data.testValue);
                }
            },
            error: function(xhr, status, errorThrown) {
                alert('오류가 발생하였습니다. [code : ' + xhr.status + '(' + status + '), message : ' + xhr.responseText + ', error : ' + errorThrown + ']');
            },
            complete: function(xhr, status) {  // success, error 인 경우 모두 발생
                //alert('complete');
            }
        });
    });
    
    function validateFormData(params, xhr, settings) {
        var validateStatus = 'success';
        if (validateStatus === 'success') {
            alert('[beforeSend]\n' + params);
        } else {
            alert('Error');
            xhr.abort();
        }
    }
    
    function executeFail(data) {
        // 첫번째 오류정보에 대해서만 처리
        var index = 0;
        if (data.errors[0].index !== undefined) {
            index = Number(data.errors[0].index);  // 1 ~
        }
        alert(data.errors[0].msg + '[' + data.errors[0].name + ']');
        
        // 포커스 처리
        if (data.errors[0].name === undefined) return false;
        if (data.errors[0].index === undefined) {  // index가 없는 경우 (배열 X)
            if (data.errors[0].event === 'focus') {
                setTimeout(function() {$('[name="' + data.errors[0].name + '"]').focus();}, 200);
            } else {
                setTimeout(function() {$('[name="' + data.errors[0].name + '"]').select();}, 200);
            }
        } else {
            if (data.errors[0].event === 'focus') {
                setTimeout(function() {$('[name="' + data.errors[0].name + '"]:eq(' + (index - 1) + ')').focus();}, 200);
            } else {
                setTimeout(function() {$('[name="' + data.errors[0].name + '"]:eq(' + (index - 1) + ')').select();}, 200);
            }
        }
    }
}


















