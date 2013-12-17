$(document).ready(function(){


    $.extend($.fn.dataTable.defaults, {
        "sDom": "<'row-fluid'<'col-md-6'f><'col-6'l>r>t<'row-fluid datatabe-footer'<'col-md-6'i><'col-md-6 datatable-pagination'p>>",
        "sPaginationType": "bootstrap",
        "bFilter": true,
        "bJQueryUI": true,
        "bAutoWidth": false
    });

    $.extend($.fn.dataTable.defaults.oLanguage, {
        "sLengthMenu": "Records per page: _MENU_",
        "sSearch": "Rechercher",
        "sProcessing": "Processing…",
        "sInfo": "Showing <strong>_START_-_END_</strong> of <strong>_TOTAL_</strong> entries",
        "sInfoEmpty": "Aucune donnée",
        "sEmptyTable": "Aucune donnée",
        "sInfoFiltered": "(filtered from _MAX_ total entries)"
    });

    $.extend($.fn.dataTable.defaults.oSearch, {
        "bCaseInsensitive": true,
        "sSearch": "",
        "bRegex": false,
        "bSmart": true
    });

    $.extend($.fn.DataTable.ext.oJUIClasses, {
        "sSortAsc": "",
        "sSortDesc": "",
        "sSortable": "",
        "sSortableAsc": "",
        "sSortableDesc": "",
        "sSortableNone": "",

        "sSortIcon": "icon-sorting",
        "sSortJUIWrapper": "sort-wrapper",
        "sSortJUI": "icon-sorting-both",
        "sSortJUIAsc": "icon-sorting-asc",
        "sSortJUIDesc": "icon-sorting-desc",
        "sSortJUIAscAllowed": "icon-sorting-asc-disabled",
        "sSortJUIDescAllowed": "icon-sorting-desc-disabled"
    });

    $.fn.dataTableExt.oApi.fnPagingInfo = function ( oSettings )
    {
        return {
            "iStart":         oSettings._iDisplayStart,
            "iEnd":           oSettings.fnDisplayEnd(),
            "iLength":        oSettings._iDisplayLength,
            "iTotal":         oSettings.fnRecordsTotal(),
            "iFilteredTotal": oSettings.fnRecordsDisplay(),
            "iPage":          Math.ceil( oSettings._iDisplayStart / oSettings._iDisplayLength ),
            "iTotalPages":    Math.ceil( oSettings.fnRecordsDisplay() / oSettings._iDisplayLength )
        };
    }


    /* Bootstrap style pagination control */
    $.extend($.fn.dataTableExt.oPagination, {
        "bootstrap": {
            "fnInit": function(oSettings, nPaging, fnDraw) {
                var oLang = oSettings.oLanguage.oPaginate;
                var fnClickHandler = function(e) {
                    e.preventDefault();
                    if(oSettings.oApi._fnPageChange(oSettings, e.data.action)) {
                        fnDraw(oSettings);
                    }
                };

                $(nPaging).addClass('pagination pagination-right').append('<ul class="pagination">' + '<li class="prev disabled"><a href="#"><i class="icon-paginate-previous"></i> <span>' + oLang.sPrevious + '</span></a></li>' + '<li class="next disabled"><a href="#"><span>' + oLang.sNext + '</span> <i class="icon-paginate-next"></i></a></li>' + '</ul>');
                var els = $('a', nPaging);
                $(els[0]).bind('click.DT', {
                    action: "previous"
                }, fnClickHandler);
                $(els[1]).bind('click.DT', {
                    action: "next"
                }, fnClickHandler);
            },

            "fnUpdate": function(oSettings, fnDraw) {
                var iListLength = 5;
                var oPaging = oSettings.oInstance.fnPagingInfo();
                var an = oSettings.aanFeatures.p;
                var i, j, sClass, iStart, iEnd, iHalf = Math.floor(iListLength / 2);

                if(oPaging.iTotalPages < iListLength) {
                    iStart = 1;
                    iEnd = oPaging.iTotalPages;
                } else if(oPaging.iPage <= iHalf) {
                    iStart = 1;
                    iEnd = iListLength;
                } else if(oPaging.iPage >= (oPaging.iTotalPages - iHalf)) {
                    iStart = oPaging.iTotalPages - iListLength + 1;
                    iEnd = oPaging.iTotalPages;
                } else {
                    iStart = oPaging.iPage - iHalf + 1;
                    iEnd = iStart + iListLength - 1;
                }

                for( i = 0, iLen = an.length; i < iLen; i++) {
                    // Remove the middle elements
                    $('li:gt(0)', an[i]).filter(':not(:last)').remove();

                    // Add the new list items and their event handlers
                    for( j = iStart; j <= iEnd; j++) {
                        sClass = (j == oPaging.iPage + 1) ? 'class="active"' : '';
                        $('<li ' + sClass + '><a href="#">' + j + '</a></li>').insertBefore($('li:last', an[i])[0]).bind('click', function(e) {
                            e.preventDefault();
                            oSettings._iDisplayStart = (parseInt($('a', this).text(), 10) - 1) * oPaging.iLength;
                            fnDraw(oSettings);
                        });
                    }

                    // Add / remove disabled classes from the static elements
                    if(oPaging.iPage === 0) {
                        $('li:first', an[i]).addClass('disabled');
                    } else {
                        $('li:first', an[i]).removeClass('disabled');
                    }

                    if(oPaging.iPage === oPaging.iTotalPages - 1 || oPaging.iTotalPages === 0) {
                        $('li:last', an[i]).addClass('disabled');
                    } else {
                        $('li:last', an[i]).removeClass('disabled');
                    }
                }
            }
        }
    });
});