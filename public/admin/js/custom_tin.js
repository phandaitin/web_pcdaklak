
$(document).ready(function () {
    
    $('select[name="group_id"]').change(function(){
        $('input[name="group_name"]').val($(this).find('option:selected').text()); //TH chọn Choose Group: validate đã kiểm tra
    });

    $('select[name="danhmuc_id"]').change(function(){
        $('input[name="danhmuc_name"]').val($(this).find('option:selected').text()); //TH chọn Choose Group: validate đã kiểm tra
    });

    $('select[name="filter_danhmuc"]').change(function(){
        var path = window.location.pathname.split('/');
        var linkRedirect = '/' + path[1] + '/' +  path[2] + '/filter-danhmuc/' + $(this).val();
        window.location.pathname = linkRedirect;
    });






})