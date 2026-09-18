<%
    function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } }

    var loggerName = "alkhateeb_common_log";

    // VARS
    sNameBlock = Trim(Request.Query.name_block);

    // FUNCTIONS
    function getRandomId() {
        return String(Date.now());
    }

    function Log(str) {
        alert("[шаблон main_page_library]: " + str);
    }

    function getCurUserId () {
        return OptInt(Trim(Request.Query.cur_user));
    }

    function getChoiceNameId () {
        return OptInt(Trim(Request.Query.id_choice_name));
    }

    function getChoiceTemaId () {
        return OptInt(Trim(Request.Query.id_choice_tema));
    }

    function getTextSearch () {
        return StrLowerCase(Trim(Request.Query.text_search));
    }
    
    function getShelves() {
        sRequest = "SELECT kps.id, [name] FROM knowledge_parts kps INNER JOIN knowledge_part kp ON kps.id = kp.id AND kps.code LIKE ('%tema-shelves%') ORDER BY kps.name ASC";
        aShelves = XQuery("sql:" + sRequest);
        return aShelves;
    }

    function getBookShelve(iShelve, sLimit) {
        addLogMessage(loggerName, "getBookShelve");

        curUser = getCurUserId();
        iShelve = OptInt(iShelve, 0);        

        // sCondView = (curUser == undefined) ? "" : "AND lmvs.person_id = " + curUser;
        // отображает все просмотры материала библиотеки
        sCondView = "";

        sRqstBooks = " " +
            " SELECT " + sLimit + " * " + 
            " FROM (SELECT * FROM " +
            "           (SELECT lms.id, lm.data.value('(library_material/name)[1]', 'varchar(max)') name, " +
            "               lm.data.value('(library_material/image)[1]', 'varchar(max)') img_id, " +
            "               lm.data.value('(library_material/author)[1]', 'varchar(max)') autor, " +
            "               k.lm.query('.').value('.', 'bigint') as knowledge_part_id " +
            "           FROM library_materials lms " +
            "               INNER JOIN library_material lm ON lms.id = lm.id " +
            "               CROSS APPLY lm.data.nodes('library_material/knowledge_parts/knowledge_part/knowledge_part_id') as k(lm) " +
            "           ) lm  " +
            "       WHERE lm.knowledge_part_id = " + iShelve + 
            "     ) books " +
            "   CROSS APPLY (SELECT COUNT(*) amnt_likes FROM likes lks WHERE lks.object_id = books.id ) X " +
            "   CROSS APPLY (SELECT COUNT(*) amnt_views FROM library_material_viewings lmvs WHERE lmvs.material_id = books.id " + sCondView + ") Y " +
            "   CROSS APPLY (SELECT COUNT(*) amnt_comments FROM blog_entry_comments becs WHERE becs.blog_entry_id = books.id ) Z " +
            " ORDER BY X.amnt_likes DESC ";
        
        //Log('sRqstBooks: ' + sRqstBooks);
        aRes = XQuery("sql:" + sRqstBooks);
        return aRes;
    }

    function getRecomendBooks(iShelve, sLimit) {
        addLogMessage(loggerName, "getRecomendBooks");

        curUser = getCurUserId();
        iShelve = OptInt(iShelve, 0);
        sCondMarkMtrl = " AND lm.data.value('(library_material/custom_elems/custom_elem[name=\"mark_recomend\"]/value)[1]', 'varchar(max)') IS NOT NULL ";

        // sCondView = (curUser == undefined) ? "" : "AND lmvs.person_id = " + curUser;
        // отображает все просмотры материала библиотеки
        sCondView = "";

        sRqstBooks = "" + 
            " SELECT " + sLimit + " * " + 
            " FROM (SELECT * FROM " +
            "           (SELECT lms.id, lm.data.value('(library_material/name)[1]', 'varchar(max)') name, " +
            "               lm.data.value('(library_material/image)[1]', 'varchar(max)') img_id, " +
            "               lm.data.value('(library_material/author)[1]', 'varchar(max)') autor, " +
            "               k.lm.query('.').value('.', 'bigint') as knowledge_part_id " +
            "           FROM library_materials lms " +
            "               INNER JOIN library_material lm ON lms.id = lm.id " +
            "               CROSS APPLY lm.data.nodes('library_material/knowledge_parts/knowledge_part/knowledge_part_id') as k(lm) " +
            "           ) lm  " +
            "     WHERE lm.knowledge_part_id = " + iShelve + sCondMarkMtrl + 
            "   ) books " +
            "       CROSS APPLY (SELECT COUNT(*) amnt_likes FROM likes lks WHERE lks.object_id = books.id) X " +
            "       CROSS APPLY (SELECT COUNT(*) amnt_views FROM library_material_viewings lmvs WHERE lmvs.material_id = books.id " + sCondView + ") Y " +
            "       CROSS APPLY (SELECT COUNT(*) amnt_comments FROM blog_entry_comments becs WHERE becs.blog_entry_id = books.id ) Z " + 
            " ORDER BY X.amnt_likes DESC ";
        
        //Log('sRqstBooks: ' + sRqstBooks);
        aRes = XQuery("sql:" + sRqstBooks);
        return aRes;
    }

    function getResultSearchShelve() {
        addLogMessage(loggerName, "getResultSearchShelve");

        curUser = getCurUserId();
        iChoiceTema = getChoiceTemaId();
        iChoiceName = getChoiceNameId();
        sTextSearch = getTextSearch();

        sCondView = (curUser != undefined) ? "AND lmvs.person_id = " + curUser : "";
        sCondSearch = "";
        if (iChoiceName != undefined) {
            sCondSearch = " AND lm.id = " + iChoiceName;
        } else if (sTextSearch != '') {
            sCondSearch = " AND " +
            " (LOWER(lm.name) like '%" + sTextSearch + "%' " +
            "    OR LOWER(lm.autor) like '%" + sTextSearch + "%' " +
            "    OR LOWER(lm.year_book) like '%" + sTextSearch + "%' " +
            "    OR LOWER(lm.desc_book) like '%" + sTextSearch + "%' " +
            "    OR LOWER(comment.message) like '%" + sTextSearch + "%' " + 
            " )";
        }      
        
        sRqstBooks = " " + 
            " SELECT * FROM " + 
            "       (SELECT lm.id, lm.name, lm.img_id, lm.autor, lm.year_book, lm.desc_book, lm.knowledge_part_id, comment.message FROM " + 
            "           (SELECT lms.id, lm.data.value('(library_material/name)[1]', 'varchar(max)') name, " + 
            "               lm.data.value('(library_material/image)[1]', 'varchar(max)') img_id, " + 
            "               lm.data.value('(library_material/author)[1]', 'varchar(max)') autor, " + 
            "               lm.data.value('(library_material/year)[1]', 'varchar(max)') year_book, " + 
            "               lm.data.value('(library_material/description)[1]', 'varchar(max)') desc_book, " +
            "               k.lm.query('.').value('.', 'bigint') as knowledge_part_id " + 
            "           FROM library_materials lms " +
            "               INNER JOIN library_material lm ON lms.id = lm.id " +
            "               CROSS APPLY lm.data.nodes('library_material/knowledge_parts/knowledge_part/knowledge_part_id') as k(lm) " + 
            "           ) lm " + 
            "               LEFT JOIN blog_entry_comments comment ON comment.blog_entry_id = lm.id " + 
            "       WHERE lm.knowledge_part_id = " + iChoiceTema + sCondSearch + 
            "       ) books " + 
            " CROSS APPLY (SELECT COUNT(*) amnt_likes FROM likes lks WHERE lks.object_id = books.id) X " +
            " CROSS APPLY (SELECT COUNT(*) amnt_views FROM library_material_viewings lmvs WHERE lmvs.material_id = books.id " + sCondView + ") Y " +
            " CROSS APPLY (SELECT COUNT(*) amnt_comments FROM blog_entry_comments becs WHERE becs.blog_entry_id = books.id) Z ";
        
        //Log('sRqstBooks: ' + sRqstBooks);

        aRes = XQuery("sql:" + sRqstBooks);
        return aRes;
    }

    function getImgMaterial () {
        return OptInt(Trim(Request.Query.id_img_material));
    }

    function getMaterial() {
        addLogMessage(loggerName, "getMaterial");

        iChoiceName = getChoiceNameId();
        curUser = getCurUserId();

        sRequest = "" + 
            " SELECT TOP 4 * " + 
            " FROM (SELECT * FROM " +
            "           (SELECT lm.id material_id, lm.data.value('(library_material/image)[1]', 'varchar(max)') img_id, " +
            "               lm.data.value('(library_material/name)[1]', 'varchar(max)') name, " +
            "               lm.data.value('(library_material/author)[1]', 'varchar(max)') autor, " +
            "               lm.data.value('(library_material/year)[1]', 'varchar(max)') material_year, " +
            "               lm.data.value('(library_material/description)[1]', 'varchar(max)') material_desc " +
            "           FROM library_material lm " +
            "           WHERE lm.id = " + iChoiceName + 
            "           ) lm  " +
            "   ) books " +
            " CROSS APPLY ( SELECT COUNT(*) amnt_views FROM library_material_viewings lmvs WHERE lmvs.material_id = books.material_id AND lmvs.person_id = " + curUser + " ) Y";

        oRes = ArrayOptFirstElem(XQuery("sql:" + sRequest));
        
        return oRes;
    }

    function getPathShelve() {
        return UrlAppendPath(global_settings.settings.portal_base_url, "/view_doc.html?mode=") + Trim(Request.Query.code_page_shelve) + "&object_id=";
    }
    
    function getPathMaterial() {
        return UrlAppendPath(global_settings.settings.portal_base_url, "/view_doc.html?mode=") + Trim(Request.Query.code_page_lbr_mtrl) + "&object_id=";
    }

    function createRequestTema(iChoiceTema, sTextSearch) {
        addLogMessage(loggerName, "createRequestTema");

        sRes = "";
        sCondition = "";
        if (iChoiceTema != undefined) {
            sCondition = "lm.knowledge_part_id = " + iChoiceTema + " AND";
        }
        
        if (sTextSearch != '') {
            sRes = "" + 
                " SELECT * FROM " +
                "   (SELECT lm.id, lm.name, lm.img_id, lm.autor, lm.year_book, lm.desc_book, lm.knowledge_part_id, comment.message FROM " +
                "       (SELECT lms.id, lm.data.value('(library_material/name)[1]', 'varchar(max)') name, " +
                "           lm.data.value('(library_material/image)[1]', 'varchar(max)') img_id, " +
                "           lm.data.value('(library_material/author)[1]', 'varchar(max)') autor, " +
                "           lm.data.value('(library_material/year)[1]', 'varchar(max)') year_book, " +
                "           lm.data.value('(library_material/description)[1]', 'varchar(max)') desc_book, " +
                "           k.lm.query('.').value('.', 'bigint') as knowledge_part_id " +
                "       FROM library_materials lms " +
                "           INNER JOIN library_material lm ON lms.id = lm.id " +
                "           CROSS APPLY lm.data.nodes('library_material/knowledge_parts/knowledge_part/knowledge_part_id') as k(lm)) lm " +
                "           LEFT JOIN blog_entry_comments comment ON comment.blog_entry_id = lm.id " +
                "       WHERE " + sCondition +
                "           (lm.knowledge_part_id IN(SELECT[id] FROM knowledge_parts kps WHERE kps.code LIKE '%tema-shelves%') " +
                "               AND ( " +
                "                   LOWER(lm.name) like '%" + sTextSearch + "%' " +
                "                   OR LOWER(lm.autor) like '%" + sTextSearch + "%' " +
                "                   OR LOWER(lm.year_book) like '%" + sTextSearch + "%' " +
                "                   OR LOWER(lm.desc_book) like '%" + sTextSearch + "%' " +
                "                   OR LOWER(comment.message) like '%" + sTextSearch + "%' " +
                "               ) " +
                "           ) " +
                "       ) lm " +
                "   CROSS APPLY (SELECT COUNT(*) amnt_likes FROM likes lks WHERE lks.object_id = lm.id) X " +
                "   CROSS APPLY (SELECT COUNT(*) amnt_views FROM library_material_viewings lmvs WHERE lmvs.material_id = lm.id) Y " +
                "   CROSS APPLY (SELECT COUNT(*) amnt_comments FROM blog_entry_comments becs WHERE becs.blog_entry_id = lm.id) Z " + 
                " ORDER BY X.amnt_likes DESC";
        } else {
            sRes = "";
            if (iChoiceTema != undefined)             {
                sCondition = "lm.knowledge_part_id = " + iChoiceTema;
                sRes = "" + 
                    " SELECT * FROM ( " +
                    "       SELECT lm.id, lm.name, lm.img_id, lm.autor, lm.year_book, lm.desc_book, lm.knowledge_part_id, comment.message FROM " +
                    "           (SELECT lms.id, lm.data.value('(library_material/name)[1]', 'varchar(max)') name, " +
                    "               lm.data.value('(library_material/image)[1]', 'varchar(max)') img_id, " +
                    "               lm.data.value('(library_material/author)[1]', 'varchar(max)') autor, " +
                    "               lm.data.value('(library_material/year)[1]', 'varchar(max)') year_book, " +
                    "               lm.data.value('(library_material/description)[1]', 'varchar(max)') desc_book, " +
                    "               k.lm.query('.').value('.', 'bigint') as knowledge_part_id " +
                    "           FROM library_materials lms " +
                    "               INNER JOIN library_material lm ON lms.id = lm.id " +
                    "               CROSS APPLY lm.data.nodes('library_material/knowledge_parts/knowledge_part/knowledge_part_id') as k(lm)) lm " +
                    "               LEFT JOIN blog_entry_comments comment ON comment.blog_entry_id = lm.id " +
                    "           WHERE " + sCondition +
                    "           ) lm  " +
                    "   CROSS APPLY (SELECT COUNT(*) amnt_likes FROM likes lks WHERE lks.object_id = lm.id ) X " +
                    "   CROSS APPLY (SELECT COUNT(*) amnt_views FROM library_material_viewings lmvs WHERE lmvs.material_id = lm.id) Y " +
                    "   CROSS APPLY (SELECT COUNT(*) amnt_comments FROM blog_entry_comments becs WHERE becs.blog_entry_id = lm.id ) Z " +
                    " ORDER BY X.amnt_likes DESC";
            }            
        }
        
        return sRes;
    }

    // MAIN
    addLogMessage(loggerName, "------------------- rmt_actn_main_page_library_FCK");
    addLogMessage(loggerName, "Started");

    switch (sNameBlock) {
        /*.................................................................. PAGE - NAME BOOK SHELVE  ..................................................................*/

        case "block-name-book-shelve":
            iChoiceTema = getChoiceTemaId();
            oBookShelve = ArrayOptFirstElem(XQuery("sql:" + 
                " SELECT kp.data.value('(knowledge_part/resource_id)[1]', 'varchar(max)') img_id, kp.data.value('(knowledge_part/name)[1]', 'varchar(max)') name " +
                " FROM [knowledge_part] kp WHERE kp.id = " + iChoiceTema));

            sHtml = (oBookShelve == undefined) ? "" : "<div class='col-12 box-img-shelve align-items-center justify-content-center' style='background: url(\"/download_file.html?file_id="+ oBookShelve.img_id +"\");background-size: cover;background-position: center center;background-repeat: no-repeat;'> <h1 class='text-center'> " + oBookShelve.name + " </h1> </div>";

            Response.Write(EncodeCharset(sHtml, 'utf-8'));
            break;
        /*.................................................................. PAGE - MAIN LIBRARY MATERIALS  ..................................................................*/

        case "block-book-week":
            iBookWeek = OptInt(Trim(Request.Query.id_book_week), 0);
            iMarkImg = OptInt(Trim(Request.Query.id_mark_img), 0);
            sUrlLibraryMtrl = getPathMaterial();

            sRequest = "" +
                " SELECT lm.data.value('(library_material/image)[1]', 'varchar(max)') book_img, " +
                "       lm.data.value('(library_material/description)[1]', 'varchar(max)') book_desc " +
                " FROM library_material lm WHERE lm.id = " + iBookWeek;

            oBookWeek = ArrayOptFirstElem(XQuery("sql:" + sRequest));
            iBookWeekImg = oBookWeek.book_img.Value;
            sBookWeekDesc = HtmlToPlainText(oBookWeek.book_desc.Value);

            sHtmlBookWeek = "<div class='col-md-6 h-100 d-flex align-items-center justify-content-center'>
                    <div class='row limit'> <img class='img-responsive' src='/download_file.html?file_id=" + iBookWeekImg + "' alt='Книга недели'> <img src='/download_file.html?file_id=" + iMarkImg + "'  class='img-mark-bk-wk' alt='пометка'> </div>
                </div>
                <div class='col-md-6 h-100 align-self-center'>
                    <p class='text-left mt-3 desc-book-week'> " + sBookWeekDesc + " </p>
                    <div class='col text-right mb-3'> <button type='button' class='btn btn-primary outline shadow-none' onClick='location.href=\"" + sUrlLibraryMtrl + iBookWeek + "\"'>Прочитать</button> </div>
                </div>";

            Response.Write(EncodeCharset(sHtmlBookWeek, 'utf-8')); 
            break;

        case "block-book-search-tema":            
            sHtmlTemsOptions = "";
            aTems = getShelves();
            for (_elem in aTems) {
                sHtmlTemsOptions += "<option value='" + _elem.id + "'>" + _elem.name + "</option>";
            }

            Response.Write(EncodeCharset(sHtmlTemsOptions, 'utf-8')); 
            break;


        case "list-find-books":
            strHtml = "";
            sUrlLibraryMtrl = getPathMaterial();
            iChoiceTema = getChoiceTemaId();
            sTextSearch = getTextSearch();
            
            sRequestTema = createRequestTema(iChoiceTema, sTextSearch);

            // Log('sRequestTema: ' + sRequestTema);

            aBooks = XQuery("sql:" + sRequestTema);

            strHtml += "<div class='col-12 p-0'>";

            sHtmlBooks = "<div class='row w-100'>";
            for (_book in aBooks) {
                sHtmlBooks += "<div class='col-lg-3 col-md-6 col-sm-12 mb-4 p-0'> 
                    <img class='d-block img-fluid mx-auto book-img' src='/download_file.html?file_id=" + _book.img_id + "' alt='" + _book.name + "' onClick='location.href=\"" + sUrlLibraryMtrl + _book.id + "\"'> 
                    <div class='social_badges'>
                        <div class='likes-book'> <img class='img-like' src='/download_file.html?file_id=6683039156807614665' alt='likes'> <span class='amnt-likes'> " + _book.amnt_likes + " </span> </div>
                        <div class='comments-book'> <img class='img-comment' src='/download_file.html?file_id=6683045530561705560' alt='comments'> <span class='amnt-comments'> " + _book.amnt_comments + " </span> </div>
                        <div class='views-book'> <img class='img-view' src='/download_file.html?file_id=6683039367023512595' alt='views'> <span class='amnt-views'> " + _book.amnt_views + " </span> </div>
                    </div>
                </div>";
            }
            
            sHtmlBooks += "</div>";
            strHtml += sHtmlBooks + "</div>";

            Response.Write(EncodeCharset(strHtml, 'utf-8'));
            break;


        case "block-result-search":
            strHtml = "";
            sUrlLibraryMtrl = getPathMaterial();
            iChoiceTema = getChoiceTemaId();
            sTextSearch = getTextSearch();
            sModeFindBooks = Trim(Request.Query.mode_find_books);
            
            sRequestTema = createRequestTema(iChoiceTema, sTextSearch);

            // Log('sRequestTema: ' + sRequestTema);

            aBooks = XQuery("sql:" + sRequestTema);

            sUrlFindBooks = UrlAppendPath(global_settings.settings.portal_base_url, "/view_doc.html?mode=") + sModeFindBooks + "&tema_id=" + UrlEncode(iChoiceTema) + "&text_search=" + UrlEncode(sTextSearch);

            if (ArrayOptFirstElem(aBooks) == undefined) {
                strHtml += "<div class='col-12 p-0'> 
                <div class='row mb-4 no-gutters align-items-center'> 
                    <div class='col-sm-12'> <p class='title-book-shelves text-center m-0'> Нет результатов, удовлетворяющих параметрам запроса. </p> </div> 
                </div>";
                // Log ("Нет результатов, удовлетворяющих параметрам запроса.");
            } else if (ArrayCount(aBooks) < 5) {
                
                strHtml += "<div class='col-12 p-0'> 
                <div class='row mb-4 no-gutters align-items-center'> 
                    <div class='col-sm-12 col-lg-12'> <p class='title-book-shelves text-left m-0'> Результаты поиска </p> </div> 
                </div>";

                sHtmlBooks = "<div class='row w-100'>";
                for (_book in aBooks) {
                    sHtmlBooks += "<div class='col-lg-3 col-md-6 col-sm-12 mb-4 p-0'> 
                        <img class='d-block img-fluid mx-auto book-img' src='/download_file.html?file_id=" + _book.img_id + "' alt='" + _book.name + "' onClick='location.href=\"" + sUrlLibraryMtrl + _book.id + "\"'> 
                        <div class='social_badges'>
                            <div class='likes-book'> <img class='img-like' src='/download_file.html?file_id=6683039156807614665' alt='likes'> <span class='amnt-likes'> " + _book.amnt_likes + " </span> </div>
                            <div class='comments-book'> <img class='img-comment' src='/download_file.html?file_id=6683045530561705560' alt='comments'> <span class='amnt-comments'> " + _book.amnt_comments + " </span> </div>
                            <div class='views-book'> <img class='img-view' src='/download_file.html?file_id=6683039367023512595' alt='views'> <span class='amnt-views'> " + _book.amnt_views + " </span> </div>
                        </div>
                    </div>";
                }
                
                sHtmlBooks += "</div> <div class='row mb-4 mt-3 no-gutters justify-content-end'>
                    <div class='col-sm-12 col-lg-3'>
                        <button type='button' class='btn btn-primary shadow-none btn-block mb-3 mb-lg-0 view-more' onClick='location.href=\"" + sUrlFindBooks + "\"'>Посмотреть все</button>
                    </div>
                </div>";
                strHtml += sHtmlBooks + "</div>";                
            } else {
                strHtml += "<div class='col-12 p-0'> 
                <div class='row mb-4 no-gutters align-items-center'> 
                    <div class='col-sm-12 col-lg-12'> <p class='title-book-shelves text-left m-0'> Результаты поиска </p> </div> 
                </div>";
    
                sHtmlBooks = "<div class='row w-100 owl-one owl-carousel owl-theme owl-loaded owl-drag'>";
                for (_book in aBooks) {
                    sHtmlBooks += "
                    <div class='item' onClick='location.href=\"" + sUrlLibraryMtrl + _book.id + "\"'> 
                        <img class='d-block book-imgd-block book-img' src='/download_file.html?file_id=" + _book.img_id + "' alt='" + _book.name + "'> 
                        <div class='social_badges'>
                            <div class='likes-book'> <img class='img-like' src='/download_file.html?file_id=6683039156807614665' alt='likes'> <span class='amnt-likes'> " + _book.amnt_likes + " </span> </div>
                            <div class='comments-book'> <img class='img-comment' src='/download_file.html?file_id=6683045530561705560' alt='comments'> <span class='amnt-comments'> " + _book.amnt_comments + " </span> </div>
                            <div class='views-book'> <img class='img-view' src='/download_file.html?file_id=6683039367023512595' alt='views'> <span class='amnt-views'> " + _book.amnt_views + " </span> </div>
                        </div>
                    </div>";
                }
        
                sHtmlBooks += "</div> <div class='row mb-4 mt-3 no-gutters justify-content-end'>
                    <div class='col-sm-12 col-lg-3'>
                        <button type='button' class='btn btn-primary shadow-none btn-block mb-3 mb-lg-0 view-more' onClick='location.href=\"" + sUrlFindBooks + "\"'>Посмотреть все</button>
                    </div>
                </div>";

                strHtml += sHtmlBooks + "</div>";
            }  

            Response.Write(EncodeCharset(strHtml, 'utf-8'));
            break;

        case "main-content":           
            aObjShelves = getShelves();

            sCodePageShevel = Trim(Request.Query.code_page_shelve);
            sCodePageLbrMtrl = Trim(Request.Query.code_page_lbr_mtrl);

            sScriptParam = "<script>";
            sHtml = "";

            sUrlShelvePage = getPathShelve();
            sUrlLibraryMtrl = getPathMaterial();

            for (_shelve in aObjShelves) {
                sShelve = "";
                aBookCurShelve = getBookShelve(_shelve.id, "TOP 10");
                if (ArrayOptFirstElem(aBookCurShelve) == undefined)
                    continue;

                sScriptParam += "$('#" + _shelve.id + "').owlCarousel(objParams);";

                sShelve += "<div class='col-12 p-0'>
                    <div class='row mb-4 no-gutters align-items-center'>
                        <div class='col-sm-12 col-lg-12'> <p class='title-book-shelves text-left m-0'> " + _shelve.name + " </p> </div>
                    </div>";

                sBooks = "<div class='row w-100 owl-carousel owl-theme owl-loaded owl-drag' id='" + _shelve.id + "'>";
                for (_book in aBookCurShelve) {
                    sBooks += "
                    <div class='item' onClick='location.href=\"" + sUrlLibraryMtrl + _book.id + "\"'> 
                        <img class='d-block book-img' src='/download_file.html?file_id=" + _book.img_id + "' alt='" + _book.name + "'> 
                        <div class='social_badges'>
                            <div class='likes-book'> <img class='img-like' src='/download_file.html?file_id=6683039156807614665' alt='likes'> <span class='amnt-likes'> " + _book.amnt_likes + " </span> </div>
                            <div class='comments-book'> <img class='img-comment' src='/download_file.html?file_id=6683045530561705560' alt='comments'> <span class='amnt-comments'> " + _book.amnt_comments + " </span> </div>
                            <div class='views-book'> <img class='img-view' src='/download_file.html?file_id=6683039367023512595' alt='views'> <span class='amnt-views'> " + _book.amnt_views + " </span> </div>
                        </div>
                    </div>";
                }

                sBooks += "
                </div> <div class='row mb-4 mt-3 no-gutters justify-content-end'>
                    <div class='col-sm-12 col-lg-3'>
                        <button type='button' class='btn btn-primary shadow-none btn-block mb-3 mb-lg-0 view-more' onClick='location.href=\"" + sUrlShelvePage + _shelve.id + "\"'>Посмотреть все</button>
                    </div>
                </div>";

                sShelve += sBooks + "</div>";
                sHtml += sShelve;
            }
            
            sHtml += sScriptParam + "</script>";

            Response.Write(EncodeCharset(sHtml, 'utf-8')); 
            break;


        /*.................................................................. BLOCK - SEARCH NAME  ..................................................................*/

        case "block-book-search-name":
            sHtmlNameOptions = "";
            iChoiceTema = getChoiceTemaId();
            sCondition = (iChoiceTema != undefined) ? "WHERE lm.kp_id = " + iChoiceTema : "";

            sRequest = "SELECT * FROM 
            (
                SELECT lm.id, lm.data.value('(library_material/name)[1]', 'varchar(max)') name,
                k.lm.query('.').value('.', 'bigint') as kp_id
                FROM library_material lm 
                CROSS APPLY lm.data.nodes('library_material/knowledge_parts/knowledge_part/knowledge_part_id') as k(lm)
          ) lm " + sCondition;

            aNames = XQuery("sql:" + sRequest);
            for (_elem in aNames)
            {
                sHtmlNameOptions += "<option value='" + _elem.id + "'>" + _elem.name + "</option>";
            }

            Response.Write(EncodeCharset(sHtmlNameOptions, 'utf-8'));
            break;

        /*.................................................................. PAGE - TEMA MATERIAL  ..................................................................*/

        case "block-rcmnd-books":
            sHtmlRecmnd = ""; 

            sUrlLibraryMtrl = getPathMaterial();
            iChoiceTema = getChoiceTemaId();
            sCndtnLimit = "TOP 4";

            aBooks = getRecomendBooks(iChoiceTema, sCndtnLimit);
            aBooks = (ArrayCount(aBooks) < 4) ? getBookShelve(iChoiceTema, sCndtnLimit) : aBooks;

            if (ArrayOptFirstElem(aBooks) == undefined) {
                Log ("Не найдено ни одной книги для полки с ID: " + iChoiceTema);
            } else {
                sHtmlRecmnd += "<div class='col-12 p-0'> 
                <div class='row mb-4 no-gutters align-items-center'> 
                    <div class='col-sm-12 col-lg-12'> <p class='title-book-shelves text-left m-0'> Рекомендованные материалы </p> </div> 
                </div> <div class='row w-100'>";
    
                sHtmlBooks = "";
                for (_book in aBooks) {
                    sHtmlBooks += "
                        <div class='col-lg-3 col-md-6 col-sm-12 mb-4 p-0'> 
                            <img class='d-block img-fluid mx-auto book-img' src='/download_file.html?file_id=" + _book.img_id + "' alt='" + _book.name + "' onClick='location.href=\"" + sUrlLibraryMtrl + _book.id + "\"'> 
                            <div class='social_badges'>
                                <div class='likes-book'> <img class='img-like' src='/download_file.html?file_id=6683039156807614665' alt='likes'> <span class='amnt-likes'> " + _book.amnt_likes + " </span> </div>
                                <div class='comments-book'> <img class='img-comment' src='/download_file.html?file_id=6683045530561705560' alt='comments'> <span class='amnt-comments'> " + _book.amnt_comments + " </span> </div>
                                <div class='views-book'> <img class='img-view' src='/download_file.html?file_id=6683039367023512595' alt='views'> <span class='amnt-views'> " + _book.amnt_views + " </span> </div>
                            </div>
                        </div>";
                }

                sHtmlRecmnd += sHtmlBooks + "</div>";
            }              
            
            Response.Write(EncodeCharset(sHtmlRecmnd, 'utf-8'));
            break;

        case "main-content-shelve":
            strHtml = "";

            sUrlLibraryMtrl = getPathMaterial();
            iChoiceTema = getChoiceTemaId();

            aBooks = getBookShelve(iChoiceTema, "");

            if (ArrayOptFirstElem(aBooks) == undefined) {
                Log ("Не найдено ни одной книги для полки с ID: " + iChoiceTema);
            } else {
                strHtml += "
                <div class='col-12 p-0'> 
                    <div class='row mb-4 no-gutters align-items-center'> 
                        <div class='col-sm-12 col-lg-12'> <p class='title-book-shelves text-left m-0'>  </p> </div> 
                    </div>";
    
                sHtmlBooks = "<div class='row w-100'>";
                for (_book in aBooks) {
                    sHtmlBooks += "<div class='col-lg-3 col-md-6 col-sm-12 mb-4 p-0'> 
                        <img class='d-block img-fluid mx-auto book-img' src='/download_file.html?file_id=" + _book.img_id + "' alt='" + _book.name + "' onClick='location.href=\"" + sUrlLibraryMtrl + _book.id + "\"'> 
                        <div class='social_badges'>
                            <div class='likes-book'> <img class='img-like' src='/download_file.html?file_id=6683039156807614665' alt='likes'> <span class='amnt-likes'> " + _book.amnt_likes + " </span> </div>
                            <div class='comments-book'> <img class='img-comment' src='/download_file.html?file_id=6683045530561705560' alt='comments'> <span class='amnt-comments'> " + _book.amnt_comments + " </span> </div>
                            <div class='views-book'> <img class='img-view' src='/download_file.html?file_id=6683039367023512595' alt='views'> <span class='amnt-views'> " + _book.amnt_views + " </span> </div>
                        </div>
                    </div>";
                }
                sHtmlBooks += "</div>";

                strHtml += sHtmlBooks + "</div>";
            } 

            Response.Write(EncodeCharset(strHtml, 'utf-8')); 
            break;

        case "result-search-shelve":
            strHtml = "";

            sUrlLibraryMtrl = getPathMaterial();
            aBooks = getResultSearchShelve();

            if (ArrayOptFirstElem(aBooks) == undefined) {
                strHtml += "<div class='col-12 p-0'> 
                <div class='row mb-4 no-gutters align-items-center'> 
                    <div class='col-sm-12'> <p class='title-book-shelves text-center m-0'> Нет результатов, удовлетворяющих параметрам запроса </p> </div> 
                </div> </div>";
            } else {
                strHtml += "<div class='col-12 p-0'> 
                <div class='row mb-4 no-gutters align-items-center'> 
                    <div class='col-sm-12 col-lg-12'> <p class='title-book-shelves text-left m-0'>  </p> </div> 
                </div>";

                sHtmlBooks = "<div class='row w-100'>";
                for (_book in aBooks)
                {
                    sHtmlBooks += "<div class='col-lg-3 col-md-6 col-sm-12 mb-4 p-0'> 
                        <img class='d-block img-fluid mx-auto book-img' src='/download_file.html?file_id=" + _book.img_id + "' alt='" + _book.name + "' onClick='location.href=\"" + sUrlLibraryMtrl + _book.id + "\"'> 
                        <div class='social_badges'>
                            <div class='likes-book'> <img class='img-like' src='/download_file.html?file_id=6683039156807614665' alt='likes'> <span class='amnt-likes'> " + _book.amnt_likes + " </span> </div>
                            <div class='comments-book'> <img class='img-comment' src='/download_file.html?file_id=6683045530561705560' alt='comments'> <span class='amnt-comments'> " + _book.amnt_comments + " </span> </div>
                            <div class='views-book'> <img class='img-view' src='/download_file.html?file_id=6683039367023512595' alt='views'> <span class='amnt-views'> " + _book.amnt_views + " </span> </div>
                        </div>
                    </div>";
                }
                sHtmlBooks += "</div>";
                strHtml += sHtmlBooks + "</div>";
            } 

            Response.Write(EncodeCharset(strHtml, 'utf-8')); 
            break;
        
        /*.................................................................. PAGE - LIBRARY MATERIAL  ..................................................................*/
        
        case "main_content-material":
            strHtml = "";
            oMaterial = getMaterial();

            bAddFavore = Trim(Request.Query.is_add_favorite);
            sClassActive = "";
            
            iImgId = OptInt(oMaterial.img_id.Value);
            iImgId = (iImgId != undefined) ? iImgId : getImgMaterial();

            if (oMaterial != undefined) {
                sActive = "";
                iMaterialId = OptInt(oMaterial.material_id.Value);
                if (bAddFavore != 'default') {
                    if (bAddFavore == 'true') {
                        sActive = 'active';

                        dViewMaterial = tools.new_doc_by_name('library_material_viewing', false);
                        dViewMaterial.BindToDb(DefaultDb);
                        teViewMaterial = dViewMaterial.TopElem;

                        teViewMaterial.material_id = iMaterialId;
                        teViewMaterial.material_name  = oMaterial.name.Value;
                        teViewMaterial.person_id = getCurUserId();
                        teViewMaterial.state_id = 'finished';
                        teViewMaterial.start_viewing_date = Date();

                        dViewMaterial.Save();
                    } else {
                        sRqst = "SELECT lmv.id lmv_id FROM library_material_viewings lmv WHERE lmv.person_id = " + getCurUserId() + " AND lmv.material_id = " + iMaterialId;
                        Log('sRqst: ' + sRqst);
                        iViewMaterialID = OptInt(ArrayOptFirstElem(XQuery("sql:" + sRqst)).lmv_id);
                        Log('iViewMaterialID: ' + iViewMaterialID);
                        if (iViewMaterialID != undefined)
                        {
                            DeleteDoc(UrlFromDocID(iViewMaterialID));
                        }
                    } 
                } else if (OptInt(oMaterial.amnt_views.Value) > 0) {
                    sActive = 'active';
                }
                
                strHtml += "<div class='row' style='max-width: 100%;'>
                    <div class='col-12 p-0'>
                        <img src='/download_file.html?file_id=" + iImgId + "' class='img-material img-fluid' alt='описание'>
                        <div class='block-desc-material'>
                            <h2 class='name-material m-0 text-center'>" + oMaterial.name.Value + "</h2>
                            <div class='details-material'>
                                <p class='name-autor-material m-0'>Автор: " + oMaterial.autor.Value + " </p>
                                <p class='year-public m-0'>Год издания: " + oMaterial.material_year.Value + " </p>
                                <div class='btn-favorite " + sActive + "'></div>
                            </div>
                            <p class='wrap-desc-material'>
                                <h3 class='desc'>Описание</h3>
                                <p class='desc-material'> " + HtmlToPlainText(oMaterial.material_desc.Value) + " </p>
                            </p>
                            <button type='button' class='btn btn-primary outline shadow-none' onClick='location.href=\"/view_play_resource.html?info=1&object_id=" + iMaterialId + "\"'>Читать</button>
                        </div>
                    </div>
                </div>"
            } else {
                strHtml += "<div class='row' style='max-width: 100%;'> <div class='col-12'> <h1> Не найден указанный материал библиотеки (id=" + getChoiceNameId() + ") </h1> </div> </div>";
            }

            Response.Write(EncodeCharset(strHtml, 'utf-8'));
            break;
        }
%>