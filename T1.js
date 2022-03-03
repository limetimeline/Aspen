/** 
    @author : Bred
    @final update : 2020.09.16
*/
var wgtArg = getParam();
var wgtEv = getParam(2);
var wgtId = getParam(3);
if (!wgtId) {
  if (wgtEv === "Page Run") fn_onSetPageRun();
  if (wgtEv === "Custom Event") fn_pageCustomEvent(wgtArg);
  if (wgtEv === "Flick Left") onMovePage_manager("left");
  if (wgtEv === "Flick Right") onMovePage_manager("right");
  if (wgtEv === "Tap") fn_onPageTap(wgtArg);
} else {
  wgtLabel = wgt.get(wgtId, "label");

  if (wgtEv === "Tap") onTap_manager(wgtLabel);
  if (wgtEv === "Tap Start") onTapStart_manager(wgtLabel);
  if (wgtEv === "Animation") {
    onAnimation_manager(wgtLabel, wgtArg);
  }
  if (wgtEv === "Flick Up") onFlickUp_manager(wgtLabel);
  if (wgtEv === "Flick Down") onFlickDown_manager(wgtLabel);
  if (wgtEv === "Drag Start") onDragStart_manager(wgtLabel);
  if (wgtEv === "Drag") onDrag_manager(wgtLabel);
  if (wgtEv === "Drag End") onDragEnd_manager(wgtLabel);
  if (wgtEv === "Media") onMedia_manager(wgtLabel, wgtArg);
  if (wgtEv === "Widget Event") fn_onWidgetEvent_manager(wgtLabel, wgtArg);
  if (wgtEv === "Custom Event") fn_widgetCustomEvent(wgtId, wgtLabel, wgtArg);
}

//**************** function in page event *************************************************************************************************************[
function fn_pageCustomEvent($arg) {
  if ($arg === "notifyContentInitFinish") {
    //컨텐츠 시작 준비 됨
  }

  if ($arg.indexOf("DeviceResponse") !== -1) {
    //device response
    var resData = exe.run("getDeviceResponse", $arg.split("__")[1]);
    if (resData) {
      if (resData.op === "notifyReceiveData") {
      }
      if (resData.op === "notifySaveStudentLessonResult") {
      }
      if (resData.op === "notifySetActivityResult")
        fn_onReceiveActivityResult(resData.data);
    }
  }
  if ($arg === "fire_hideKeyboard") {
    console.error("fire_hideKeyboard");
  }
}
function fn_onPageTap($arg) {}
function onTap_manager($label) {
  if ($label == "checkBtn") fn_onClickCheckBtn();
  if ($label == "nextBtn") fn_onClickNextBtn();
  if ($label == "submitBtn") fn_onClickSubmitBtn();
}
function onTapStart_manager($label) {}
function onFlickUp_manager($label) {}
function onFlickDown_manager($label) {}
function onDragStart_manager($label) {
  var typePrefix = fn_getTypePrefix();
  if (
    !isEmpty(get(typePrefix + "dragLabel")) &&
    $label.indexOf(get(typePrefix + "dragLabel")) >= 0
  ) {
    fireCustomEvent("stopSnd");
    fn_onDragStart($label);
  }
}
function onDrag_manager($label) {}
function onDragEnd_manager($label) {
  var typePrefix = fn_getTypePrefix();
  if (
    !isEmpty(get(typePrefix + "dragLabel")) &&
    $label.indexOf(get(typePrefix + "dragLabel")) >= 0
  )
    fn_onDragEnd($label);
}
function onMovePage_manager($dir) {}
function onAnimation_manager($label, $arg) {}
function onMedia_manager($label, $arg) {}
function fn_onWidgetEvent_manager($label, $arg) {}
function fn_widgetCustomEvent(wgtId, wgtLabel, wgtArg) {}

function fn_onReceiveActivityResult($data) {
  var data = $data;
  var answerList = data.answerList;
  if (answerList) {
    //재학습
  } else {
    // 최초학습
  }
}

function fn_onSetPageRun() {
  exe.run("runDevice", { op: "contentInitAllOp" });
  fn_onSetUI(); //common code
  fn_onSetVars();
  fn_init();
}

function fn_onSetUI() {
  //common code
  wgt.moveTo(getWidget("thumb_img"), 2000, 0);

  wgt.zIndexTo(getWidget("ctnBox"), "top");
  wgt.moveTo(getWidget("ctnBox"), 1123, 85);
}

function fn_onSetCount() {
  var total = fn_getDigit(get("total"));
  var curNum = fn_getDigit(get("curNum"));

  wgt.set(getWidget("curTxt"), "text", curNum);
  wgt.set(getWidget("totalTxt"), "text", total);
}

function fn_getDigit($c) {
  if ($c < 10) {
    return "0" + String($c);
  } else {
    return String($c);
  }
}

//전체 문항 학습결과 조회 ******************************************************************
function fn_onCheckStudyResult() {
  //전체 문항 학습결과 조회
  //이전 학습 결과 데이터 조회
  //var myAnswer = exe.run('getMyAnswerSeq')          // 내가 문제풀이 제출했던 정보 받아옴
  //var answerList = myAnswer.answerList

  var allComp = 1;
  /*for(i=0; i<answerList.length; i++)
    {
        var seq = answerList[i].answerSequence
        for(h=0; h<seq.length; h++)
        {
            var applyYN = seq.applyYN
            if(applyYN == 'Y')
            {
                
            }else{
                allComp = -1
            }
        }
    }*/

  if (exe.isPreview()) {
    allComp = get("allComp"); // 1 : 모든 문제 학습완료 , -1 : 모든 문제 학습 미완료
    //allComp = 1
  }

  if (allComp == 1) {
    //모든 문제 학습완료
    //학습진행없이 채점 화면노출
    var contCode = exe.run("getAuthCode");
    var myAnswerSep = [];
    /*for(i=0; i<answerList.length; i++)
        {
            var proCode = answerList[i].projectAuthoringCode
            if(proCode == contCode )
            {
                myAnswerSep = answerList[i].answerSequence
            }
        }*/

    if (exe.isPreview()) {
      var data = {
        seq: 1,
        correctAnswer: "shoulder",
        userAnswer: "shoulder",
        correctYN: "Y",
        applyYN: "N",
        tryCount: 1,
      };
      myAnswerSep = [];
      myAnswerSep.push(data);
    }

    fn_setResultPage(myAnswerSep);
  } else {
    //모든 문제 미완료
    //학습진행
    var curNum = get("curNum");
    var totalNum = get("totalNum");

    if (curNum == 1) {
      //첫번째 문제 일경우 가이드 팝업 노출
      fireCustomEvent("fire_guidePopUp");
    }
  }
}

function fn_setResultPage($myAnswerSep) {
  //채점 화면, 학습진행 불가
  var myAnswerSep = $myAnswerSep;
  //채점 화면, 학습진행 불가
}

function fn_setNextOrSubmitButton() {
  //Next 버튼 또는 Submit 버튼 노출
  var curQData = get("curQData");
  var correctAns = curQData.answ;

  var answer = get("answer");
  var ansNum = answer.num;
  var ansTxt = answer.txt;
  var correctYN = "";
  if (correctAns === ansTxt) correctYN = "Y";
  else correctYN = "N";

  //TODO: 저장 관련 정보 수령 후 수정 예정
  var data = {
    seq: 1,
    correctAnswer: correctAns,
    userAnswer: ansTxt,
    correctYN: correctYN,
    applyYN: "N",
    tryCount: 1,
  };
  myAnswerSep = [];
  myAnswerSep.push(data);
  set("myAnswerSep", myAnswerSep);

  //TODO 삭제 필요
  wgt.zIndexTo(getWidget("checkBtn"), "top");
  wgt.set(getWidget("checkBtn"), "visibility", "visible");

  wgt.zIndexTo(getWidget("nextBtn"), "top");
  wgt.moveTo(getWidget("nextBtn"), 1161, 737);
}

function fn_onClickNextBtn() {
  //Next 버튼 클릭
  //학습결과저장(코리아폴리스쿨 내부에서 개발진행하겠습니다. )
}

function fn_onClickSubmitBtn() {
  //Submit 버튼 클릭
  fireCustomEvent("fire_submitBtn");
  //학습결과저장(코리아폴리스쿨 내부에서 개발진행하겠습니다. )
}

function fn_onClickCheckBtn() {
  var typePrefix = fn_getTypePrefix();
  var checkCnt = get(typePrefix + "checkCnt");
  //console.error('fn_checkDragDrop checkCnt : ', checkCnt);
  var inputAnsArr = get(typePrefix + "inputAnsArr");

  //fn_answerInit();
  var chkAll = true;
  for (i = 0; i < inputAnsArr.length; i++) {
    var inputAns = inputAnsArr[i];
    var correctText = inputAnsArr[i].correctText;
    var tmpText = inputAnsArr[i].inputText;
    //if (inputAns.chkFixed == false)
    {
      if (tmpText == correctText) {
        fn_setDragDropTextColor(inputAns.layer, "#002bff");
        inputAnsArr[i].chkCorrect = true;
      } else {
        fn_setDragDropTextColorWithUnder(
          inputAns.layer,
          correctText,
          "#002bff",
          "#ff2a2a"
        );
        inputAnsArr[i].chkCorrect = false;
        chkAll = false;
      }
    }
  }
  if (chkAll == false) {
    fn_setInCorrectDragDrop();
  } else {
    fn_setCorrectDragDrop();
  }

  //wgt.zIndexTo(getWidget('submitBtn'), 'top');
  //wgt.moveTo(getWidget('submitBtn'), 2000, 737);
  wgt.zIndexTo(getWidget("nextBtn"), "top");
  wgt.moveTo(getWidget("nextBtn"), 2000, 737);

  set("allComp", 1);
}

//**************************************************************************************************************************************

function fn_getTypePrefix() {
  var curTypeIndex = get("curTypeIndex");
  //console.error('fn_getTypePrefix curTypeIndex : ',curTypeIndex)
  var TypePrefixArr = get("TypePrefixArr");
  return "T1#"; //TypePrefixArr[curTypeIndex];
}

function fn_getTypePrefixByIndex(index) {
  var TypePrefixArr = get("TypePrefixArr");
  return "T1#"; //TypePrefixArr[index];
}

function fn_init() {
  //TODO-1 fn_init 내 설정 코드 Copy/Paste
  //TODO-2 tool 용 함수 Copy/Paste
  //TODO-3 Select Widget 사용시 onTap_manager 함수 내 코드 Copy/Paste
  //TODO-4 Drag/Drop 또는 Unscramble Widget 사용시 onDragStart_manager, onDragEnd_manager 함수 내 코드 Copy/Paste
  //TODO-5 tool 설정값 변경 ############## 으로 코멘트 된 라인
  //Coding Rule : file.get/set, get/set 최소 사용 (꼭 필용한 5개 이내)
  /***********************************************************************************************************************************************
   * Copy and Paste MultiSelect Code - Start //TODO-1 fn_init 내 설정 코드 Copy/Paste
   * 아래 코드를 복사하여 fn_init() 함수안에 붙여넣어 설정값을 입력하여 사용. 입력값 라인에 ############## 표시
   * Widget 구성
   * Question Layer   : direction
   * number       : num
   * text         : Txt
   * Select Layer     : IT_MS_S
   * checkBox     : chk
   * text         : sText
   *
   * 주요 변수 구성
   *  qDataArr            : Question DataTable Array
   *  sDataArr            : Select DataTable Array
   *  qToolArr            : Question Tool Layer Array
   *  sToolArr            : Select Tool Layer Array
   *  selectOption        : Select 관련 옵션 정보 selectOption = {maxSelect: 0}
   *
   * 주요 함수 설정
   *  onTap_manager       : onTap_manager 함수 내 아래 코드 추가
   *                        if(wgtLabel.indexOf(get(sToolName) === 0) fn_clickSelect(sToolName));
   *  fn_clickSelect      : select tool click 시 이벤트 처리
   *
   * */
  set("curTypeIndex", 2);
  // file.set/get : overlay, page 간 변수 전달
  var qDataArr = file.get("T1#qDataArr"); //{num:num, x:x, y:y, nVisibility:nVisibility, nFontsize:nFontsize, direction:direction,
  //directionVisibility:directionVisibility, directionFontsize:tFontsize, image:image, imageX:imageX, imageY:imageY,
  //sentence:sentence, sentenceVisibility:sentenceVisibility, sentenceFontsize:sentenceFontsize, KoreanText:KoreanText};
  //console.error(qDataArr);
  // tool array
  var qToolArr = []; // init()에서 선언만 되어있지 할당되지는 않았음.

  //Question tool option 설정: TODO-5 tool 설정값 변경 ############## 으로 코멘트 된 라인
  var question = {
    // 각 변수에 필요한 값 직접 설정
    typePrefix: "T1#", // ############## Type별 구분 명칭
    qToolLabel: "direction", // ############## Widget 명
    qImageLabel: "img", // ############## Widget 명
    initX: 119, // ############## Location init x 설정
    initY: 79, // ############## Location init y 설정
    spaceX: 0, // ############## Location 간격 x 설정
    spaceY: 80, // ############## Location 간격 y 설정
    colLength: 1, // ############## 자동 생성 Question 배열의 열 갯수
    rowLength: 1, // ############## 자동 생성 Question 배열의 행 갯수
    chkInputLocation: false, // ############## Location 설정 방법 true : 직접 입력 (DataTable 설정 값), false : 간격 계산 설정
    qdVisibility: "visible", // ############## question layout 표시 설정 (Default : visible)
    ndVisibility: "visible", // ############## num 표시 설정 (Default : visible)
    //ndFont : 'Noto Sans s',      // ############## Font (Default : Noto Sans s)
    ndFontSize: 24, // ############## Font Size (Default : 24)
    tdVisibility: "visible", // ############## text 표시 설정 (Default : visible)
    //sdFont : 'Noto Sans s',      // ############## Font (Default : Noto Sans s)
    tdFontSize: 24, // ############## Font Size (Default : 24)
    chkImageFixed: false, // ############## 이미지 위치 고정 여부 설정 true : DataTable 설정값, false :  아래 설정값 사용
    imageFixedX: 310, // ############## 이미지 위치 직접 설정 x
    imageFixedY: 184, // ############## 이미지 위치 직접 설정 y
    resultGapX: 24, // ############## 채점 결과 OX 위치 조정 x
    resultGapY: 0, // ############## 채점 결과 OX 위치 조정 y
    sentenceLabel: "sentenceDropBox", // ############## sentence Widget 명
    sentenceInitX: 149, // ############## sentence Location init x 설정
    sentenceInitY: 473, // ############## sentence Location init y 설정
    sentenceBoxInitX: 116, // ############## sentence Location init x 설정
    sentenceBoxInitY: 459, // ############## sentence Location init y 설정
    sentenceDefaultFontSize: 24, // ############## Font Size (Default : 24)
    sentenceDefaultVisibility: "visible", // ############## Font Size (Default : 24)
    sentenceGapX: 10, // ############## sentence Location 간격 x 설정
    sentenceGapY: 85, // ############## sentence Location 간격 y 설정
    chkFixedWidthSentence: false, // ############## sentence Location 간격 y 설정
    sentenceWidth: 176, // ############## sentence width
    sentenceMaxLength: 15, // ############## sentence 최대 글자 수
    sentenceAutoFontSize: false, // ############## sentence 자동 폰트 사이즈 조정
    sentenceAutoNewLine: true, // ############## sentence 최대 글자 수
    sentenceMaxRow: 3, // ############## sentence 최대 개행 수
  };

  //console.error('qDataArr.length =>', qDataArr.length);
  if (qDataArr.length > 0) {
    if (qDataArr[0].imageOnOff == "off") {
      question.sentenceInitY = 335;
      question.sentenceBoxInitY = 321;
    }
    fn_setQuestion(question);

    // sentence 설정

    if (qDataArr[0].sentenceType == "chunk") {
      question.sentenceLabel = "sentenceDropLBox";
    }
    for (i = 0; i < qDataArr.length; i++) {
      //wgt.set(getWidget('T1#text'), 'text', qDataArr[i].KoreanText);
      //wgt.set(getWidget('T1#text'), 'fontSize', qDataArr[i].KoreanFontSize);
      fn_setSentenceDropBox(
        question,
        qDataArr[i].sentence,
        qDataArr[i].correctSentencePlay
      );
    }
  }
  //console.error('End of question setting');

  //TODO-5 tool 설정값 변경 ############## 으로 코멘트 된 라인
  //DragAndDrop tool option 설정--------------------------------------------------------------------------------------
  //var obj = {type:type, text:text};
  var dragAndDropDataArr = file.get("T1#dragAndDropDataArr");

  var dragAndDrop = {
    // 각 변수에 필요한 값 직접 설정
    typePrefix: "T1#", // ############## Type별 구분 명칭
    dragLabel: "dragBox", // ############## Widget 명
    initX: 901, // ############## dragBox Location init x 설정
    initY: 211, // ############## dragBox Location init y 설정
    min: 2, // ############## 최소 표시 박스 수 (값이 없어도 표시)
    max: 7, // ############## 최대 표시 박스 수
    spaceX: 20, // ############## Location 간격 x 설정
    spaceY: 10, // ############## Location 간격 y 설정
    colLength: 1, // ############## 자동 생성 unscramble 배열의 열 갯수 (0 설정 시 데이터 갯수에 따라 자동 생성)
    rowLength: 7, // ############## 자동 생성 unscramble 배열의 행 갯수
    chkAutoCenterize: false, // ############## 자동 생성 unscramble 배열 전체를 화면 가운데 맞춰 이동 : true, initX 좌표를 기준으로 생성
    chkInputLocation: false, // ############## Location 설정 방법 true : 직접 입력 (DataTable 설정 값), false : 간격 계산 설정
    defaultVisibility: "visible", // ############## dragAndDrop layout 표시 설정 (Default : visible)
    rowWidth: 245,
    //defaultFontSize : 25                 // ############## Font Size (Default : 24)
  };

  if (qDataArr[0].sentenceType == "chunk") {
    dragAndDrop.dragLabel = "dragLBox";
    dragAndDrop.sentenceGapX = 27;
    dragAndDrop.colLength = 2;
    dragAndDrop.max = 2;
    dragAndDrop.sentenceType = "chunk";
    dragAndDrop.maxText = 24;
  }

  //console.error('Start of DragAndDrop setting');
  if (dragAndDropDataArr.length > 0) {
    fn_setDragAndDrop(dragAndDrop);
  }
  //console.error('End of DragAndDrop setting');
  /***********************************************************************************************************************************************
   * Copy and Paste MultiSelect Code - End
   */
  set(fn_getTypePrefix() + "checkCnt", 2);
}

function fn_onSetVars() {
  var curNum = file.get("curNum");
  var totalNum = file.get("totalNum");

  set("curNum", curNum); //현재 문항 번호
  //set('totalNum', 1);//전체 문항 번호
  set("totalNum", totalNum); //전체 문항 번호

  set("allComp", -1); // 1 : 모든 문제 학습완료 , -1 : 모든 문제 학습 미완료
}

/***********************************************************************************************************************************************
 * Copy and Paste MultiSelect Code - Start //TODO-2 tool 용 함수 Copy/Paste
 * 아래 함수를 복사/붙여넣어 사용.
 * 주요 변수 구성
 *  question = { // 각 변수에 필요한 값 직접 설정
        typePrefix : 'T1#',             // ############## Type별 구분 명칭
        qToolLabel : 'question',     // ############## Widget 명
        qImageLabel : 'img',   // ############## Widget 명
        initX: 100,                  // ############## Location init x 설정
        initY : 100,                 // ############## Location init y 설정
        spaceX : 0,                  // ############## Location 간격 x 설정
        spaceY : 80,                 // ############## Location 간격 y 설정
        colLength : 1,               // ############## 자동 생성 Question 배열의 열 갯수 
        rowLength : 1,               // ############## 자동 생성 Question 배열의 행 갯수 
        chkInputLocation : false,    // ############## Location 설정 방법 true : 직접 입력 (DataTable 설정 값), false : 간격 계산 설정 
        qdVisibility : 'visible',    // ############## question layout 표시 설정 (Default : visible)
        ndVisibility : 'visible',    // ############## num 표시 설정 (Default : visible)
        ndFontSize : 24,             // ############## Font Size (Default : 24)
        tdVisibility : 'visible',    // ############## text 표시 설정 (Default : visible)
        tdFontSize : 24              // ############## Font Size (Default : 24)
        chkImageFixed : false        // ############## 이미지 위치 고정 여부 설정 true : 아래 설정값 사용, false : DataTable 설정값 사용
        imageFixedX : 450,           // ############## 이미지 위치 직접 설정 x
        imageFixedY : 100            // ############## 이미지 위치 직접 설정 y
    }
 *  qDataArr            : Question DataTable Array
 *  qToolArr            : Question Tool Layer Array
 * */
function fn_setQuestion(question) {
  var typePrefix = question.typePrefix;

  //원본 Tool 화면 밖으로 이동
  var qToolOrg = getWidget(typePrefix + question.qToolLabel);
  wgt.moveTo(qToolOrg, 2000, 0);

  // file.set/get : overlay, page 간 변수 전달
  var qDataArr = file.get(typePrefix + "qDataArr"); //{num:num, x:x, y:y, nVisibility:nVisibility, nFontsize:nFontsize, direction:direction,
  //directionVisibility:directionVisibility, directionFontsize:tFontsize, image:image, imageX:imageX, imageY:imageY,
  //sentence:sentence, sentenceVisibility:sentenceVisibility, sentenceFontsize:sentenceFontsize};
  /**
     * 
       var obj = {num:num, x:x, y:y, nVisibility:nVisibility, nFontsize:nFontsize, direction:direction, 
                    directionVisibility:directionVisibility, directionFontsize:directionFontsize, image:image, imageX:imageX, imageY:imageY, 
                    sentence:sentence, sentenceVisibility:sentenceVisibility, sentenceFontsize:sentenceFontsize, sentenceFontBold:sentenceFontBold, answer:answer};//};
     * */
  // tool array
  var qToolArr = [];

  var qToolLabel = question.qToolLabel;
  var initX = question.initX;
  var initY = question.initY;
  var spaceX = question.spaceX;
  var spaceY = question.spaceY;
  var colLength = question.colLength;
  var rowLength = question.rowLength;
  var chkInputLocation = question.chkInputLocation;

  var qdVisibility = question.qdVisibility;

  var ndVisibility = question.ndVisibility;
  //var ndFont = question.ndFont;
  var ndFontSize = question.ndFontSize;

  var tdVisibility = question.tdVisibility;
  //var sdFont = question.sdFont;
  var tdFontSize = question.tdFontSize;

  var resultGapX = question.resultGapX;
  var resultGapY = question.resultGapY;

  var toolX = 0;
  var toolY = 0;
  var colCnt = 1;
  var rowCnt = 1;
  //DataTable 의 Question Data 수 만큼 생성
  for (i = 0; i < qDataArr.length; i++) {
    var index = i + 1;
    var qTool = wgt.clone(qToolOrg);
    ////console.error('question layout => ', qTool)
    wgt.set(qTool, "label", typePrefix + qToolLabel + "_" + index);
    wgt.set(qTool, "visibility", qdVisibility);

    // 문항 설정 (DataTable num)
    wgt.set(getWidget("num", qTool), "text", qDataArr[i].num);
    if (qDataArr[i].nVisibility !== "") {
      //console.error('nVisibility => ', qDataArr[i].nVisibility);
      wgt.set(getWidget("num", qTool), "visibility", qDataArr[i].nVisibility);
    } else {
      //console.error('nVisibility(default) => ', ndVisibility);
      wgt.set(getWidget("num", qTool), "visibility", ndVisibility);
    }

    //wgt.set(getWidget('num', qTool), 'font', qDataArr[i].nfont);
    if (qDataArr[i].nFontsize > 0) {
      wgt.set(getWidget("num", qTool), "fontSize", qDataArr[i].nFontsize);
    } else {
      wgt.set(getWidget("num", qTool), "fontSize", ndFontSize);
    }

    // 문제(지시문) 텍스트 설정 (DataTable direction)
    //console.error('문제(지시문) text => ', qDataArr[i].direction);
    //console.error('문제(지시문) tVisibility => ', qDataArr[i].directionVisibility);
    wgt.set(getWidget("Txt", qTool), "text", qDataArr[i].direction);
    if (qDataArr[i].directionVisibility !== "") {
      //console.error('문제(지시문) tVisibility => ', qDataArr[i].directionVisibility);
      //wgt.set(getWidget('Txt', qTool), 'visibility', qDataArr[i].tVisibility);
    } else {
      //console.error('문제(지시문) tdVisibility(default) => ', tdVisibility);
      wgt.set(getWidget("Txt", qTool), "visibility", tdVisibility);
    }
    //wgt.set(getWidget('Txt', qTool), 'font', qDataArr[i].qfont);
    if (qDataArr[i].directionFontsize > 0) {
      wgt.set(
        getWidget("Txt", qTool),
        "fontSize",
        qDataArr[i].directionFontsize
      );
    } else {
      wgt.set(getWidget("Txt", qTool), "fontSize", tdFontSize);
    }

    //Location 설정
    if (chkInputLocation) {
      toolX = qDataArr[i].x;
      toolY = qDataArr[i].y;
    } else {
      toolX = initX + spaceX * (colCnt - 1);
      toolY = initY + spaceY * (rowCnt - 1);
      if (colCnt < colLength) {
        colCnt = colCnt + 1;
      } else if (colCnt === colLength) {
        colCnt = 1;
        rowCnt = rowCnt + 1;
      }
    }

    if (qDataArr[i].image.length > 0) {
      var qImageOrg = getWidget(typePrefix + question.qImageLabel);
      wgt.moveTo(qImageOrg, 2000, 0);
      var qImage = wgt.clone(qImageOrg);
      //console.error('image => ', qDataArr[i].image)
      wgt.set(qImage, "label", typePrefix + qToolLabel + "_" + index);
      wgt.set(qImage, "media", qDataArr[i].image);
      if (question.chkImageFixed === false) {
        wgt.moveTo(qImage, question.imageFixedX, question.imageFixedY);
      } else {
        wgt.moveTo(qImage, qDataArr[i].imageX, qDataArr[i].imageY);
      }
    }
    wgt.moveTo(qTool, toolX, toolY);

    //num Text 크기 따라 txt Location x 값 자동 계산
    wgt.sizeByContent(getWidget("num", qTool), true, false);
    var numW = wgt.get(getWidget("num", qTool), "w");
    var numX = wgt.get(getWidget("num", qTool), "x");
    var txtX = numX + numW;
    wgt.set(getWidget("Txt", qTool), "x", txtX + 3);

    wgt.moveTo(
      getWidget(typePrefix + "result"),
      toolX - resultGapX,
      toolY - resultGapY
    );
    //wgt.set(getWidget('result'),)

    // sentence 설정

    // sentenceLabel : 'sentence',            // ############## sentence Widget 명
    // sentenceInitX: 150,                  // ############## sentence Location init x 설정
    // sentenceInitY : 500,                 // ############## sentence Location init y 설정
    // sentenceDefaultFontSize : 27,             // ############## Font Size (Default : 24)
    // sentenceDefaultVisibility : 'visible',             // ############## Font Size (Default : 24)
    // sentenceGapX : 23,                  // ############## sentence Location 간격 x 설정
    // sentenceGapY : 63,                 // ############## sentence Location 간격 y 설정
    // chkFixedWidthSentence : false                 // ############## sentence Location 간격 y 설정
    // sentenceWidth: 277,                  // ############## sentence width
    // sentenceMaxLength: 15,                  // ############## sentence 최대 글자 수
    // sentenceAutoFontSize : true                 // ############## sentence 자동 폰트 사이즈 조정
    // sentenceAutoNewLine: false,                  // ############## sentence 최대 글자 수
    // sentenceMaxRow : 1                 // ############## sentence 자동 폰트 사이즈 조정
    // if (question.sentenceLabel == 'sentenceUnderLine')
    //     fn_setSentenceUnderLine(question, qDataArr[i].sentence);
    // else if (question.sentenceLabel == 'sentence')
    //     fn_setSentence(question, qDataArr[i].sentence);
    // else if (question.sentenceLabel == 'sentenceDropBox')
    //     fn_setSentenceDropBox(question, qDataArr[i].sentence);

    wgt.run(qTool, "layout", true);

    qToolArr.push(qTool);
  }
  set(typePrefix + "qToolArr", qToolArr);
}

/**
 * fn_setSentenceDropBox 설정
        typePrefix : '',             // ############## Type별 구분 명칭
        sentenceLabel : 'sentence',            // ############## sentence Widget 명
        sentenceInitX: 150,                  // ############## sentence Location init x 설정
        sentenceInitY : 500,                 // ############## sentence Location init y 설정
        sentenceDefaultFontSize : 24,             // ############## Font Size (Default : 24)
        sentenceDefaultVisibility : 'visible',             // ############## Font Size (Default : 24)
        sentenceGapX : 10,                  // ############## sentence Location 간격 x 설정
        sentenceGapY : 63,                 // ############## sentence Location 간격 y 설정
        chkFixedWidthSentence : false,                 // ############## sentence Location 간격 y 설정
        sentenceWidth: 277,                  // ############## sentence width
        sentenceMaxLength: 15,                  // ############## sentence 최대 글자 수
        sentenceAutoFontSize : false,                 // ############## sentence 자동 폰트 사이즈 조정
        sentenceAutoNewLine: false,                  // ############## sentence 최대 글자 수
        sentenceMaxRow : 2,                 // ############## sentence 자동 폰트 사이즈 조정
        chkUseDragDrop : true,                 // ############## sentence 내 [ ] 구간을 DropBox 로 변환 : true, 미사용시 : false 설정
        dropboxAutoFontSize : true,                 // ############## dropbox 자동 폰트 사이즈 조정
        //dropboxLabel : 'sentenceDropbox'          // ############## Widget 명 dragDrop 사용시 설정
        sentenceMaxRow : 2                 // ############## sentence 최대 개행 수
**/
function fn_setSentenceDropBox($question, $sentence, $correctSentencePlay) {
  var typePrefix = $question.typePrefix;
  var $sentenceLabel = $question.sentenceLabel;
  var $initX = $question.sentenceInitX;
  var $initY = $question.sentenceInitY;
  var $gapX = $question.sentenceGapX;
  var $gapY = $question.sentenceGapY;
  var $chkFixedWidthBlank = $question.chkFixedWidthSentence;
  var $sentenceMaxLength = $question.sentenceMaxLength;
  var $sentenceDefaultFontSize = $question.sentenceDefaultFontSize;
  var $sentenceWidth = $question.sentenceWidth;

  var chkUseDragDrop = $question.chkUseDragDrop;
  var sentenceMaxRow = $question.sentenceMaxRow;
  var dropboxAutoFontSize = $question.dropboxAutoFontSize;
  var dropboxLabel = $question.dropboxLabel;

  set(
    typePrefix + "CorrectAnswer",
    $sentence.split("[").join("").split("]").join("").split("\n").join("")
  );
  set(typePrefix + "TTSWordPlay", $correctSentencePlay);
  var sentenceCharArr = $sentence.split("");
  var input = { id: 0, text: "", chkBlank: true, chkNewRow: false };
  var inputArr = [];
  var id = 0;
  var tempTxt = "";
  var chkBlank = false;
  var chkBlankStart = false;
  for (i = 0; i < sentenceCharArr.length; i++) {
    switch (sentenceCharArr[i]) {
      case "[":
        if (tempTxt.length > 0) {
          input = { id: id, text: tempTxt, chkBlank: false, chkNewRow: false };
          inputArr.push(input);
          id = id + 1;
          tempTxt = "";
          chkBlankStart = true;
        }
        break;
      case "]":
        input = { id: id, text: tempTxt, chkBlank: true, chkNewRow: false };
        inputArr.push(input);
        id = id + 1;
        tempTxt = "";
        chkBlankStart = false;
        break;
      case "\n":
        //console.error('new row ################################################')
        if (tempTxt.length > 0) {
          input = { id: id, text: tempTxt, chkBlank: false, chkNewRow: false };
          inputArr.push(input);
          id = id + 1;
          tempTxt = "";
        }
        input = { id: id, text: tempTxt, chkBlank: false, chkNewRow: true };
        inputArr.push(input);
        id = id;
        tempTxt = "";
        break;
      default:
        if (
          tempTxt.length > 0 &&
          sentenceCharArr[i] == " " &&
          chkBlankStart === false
        ) {
          input = { id: id, text: tempTxt, chkBlank: false, chkNewRow: false };
          inputArr.push(input);
          id = id + 1;
          tempTxt = "";
        } else {
          tempTxt = tempTxt + sentenceCharArr[i];
          if (i == sentenceCharArr.length - 1) {
            input = {
              id: id,
              text: tempTxt,
              chkBlank: false,
              chkNewRow: false,
            };
            inputArr.push(input);
          }
        }
        break;
    }
  }

  var lineWidth = 1014;
  var curWidth = 0;
  var initX = $initX;
  var initY = $initY;
  var curX = initX;
  var curY = initY;
  var gapX = $gapX;
  var gapTextX = 5;
  var gapY = $gapY;
  var ansLayerArr = [];
  var prevChkBlank = false;
  var inputAnsArr = [];
  var rowCnt = 1;
  for (j = 0; j < inputArr.length; j++) {
    var tempInput = inputArr[j];
    if (tempInput.chkNewRow == false) {
      tempInput.text = tempInput.text.trim();
      var sWidget = wgt.clone(getWidget(typePrefix + $sentenceLabel));
      wgt.set(sWidget, "label", typePrefix + $sentenceLabel + "_" + (j + 1));
      wgt.set(getWidget(typePrefix + $sentenceLabel), "visibility", "hidden");
      if (tempInput.chkBlank == false) {
        wgt.changeState(sWidget, "Default");
        wgt.set(getWidget("text", sWidget), "visibility", "visible");
        wgt.set(getWidget("text", sWidget), "text", tempInput.text);
        wgt.sizeByContent(getWidget("text", sWidget), true, false);
        var wordW = wgt.get(getWidget("text", sWidget), "w");
        wgt.set(sWidget, "w", wordW + 5);
      } else {
        //TO-DO 최종 확인 필요. 문장 최대 글자 수 넘을 경우, 넘는 문자 잘라서 세팅
        var sText = tempInput.text.substr(0, $sentenceMaxLength);

        wgt.changeState(sWidget, "Dropbox");
        wgt.set(getWidget("underWord", sWidget), "visibility", "hidden");
        wgt.set(getWidget("wordDrop", sWidget), "visibility", "hidden");
        wgt.set(getWidget("wordDrop", sWidget), "text", sText);

        //Widget Clone 으로 문장 길이가 최대폭을 넘는지 확인
        //최대폭을 넘을 경우 FontSize를 1 씩 줄이면서 최대폭 내에 들어갈때 까지 반복
        var curFontSize = $sentenceDefaultFontSize;
        if (dropboxAutoFontSize == true) {
          var tempWidget = wgt.clone(getWidget("wordDrop", sWidget));
          wgt.set(tempWidget, "label", "tempSentence");
          wgt.moveTo(tempWidget, 2000, 0);
          wgt.set(tempWidget, "text", sText);

          for (i = 0; i < 10; i++) {
            wgt.sizeByContent(tempWidget, true, false);
            var w = wgt.get(tempWidget, "w");
            if (w <= $sentenceWidth) {
              break;
            } else {
              curFontSize = curFontSize - 1;
              wgt.set(tempWidget, "fontSize", curFontSize);
            }
            //console.error('$sentenceAutoFontSize for i ', i + ' : ' + curFontSize);
          }

          wgt.set(getWidget("wordDrop", sWidget), "fontSize", curFontSize);
        }
      }
      var layerW = wgt.get(sWidget, "w");
      var tempWidth = curWidth + layerW;
      if (tempWidth <= lineWidth) {
        curX = initX + curWidth;
      } else {
        rowCnt = rowCnt + 1;
        if (rowCnt <= sentenceMaxRow) {
          curY = curY + gapY;
        } else {
          curY = curY + 800;
        }
        curX = initX;
        curWidth = 0;
        //console.error('Change Line curX =>', curX);
      }
      if (tempInput.chkBlank == false) curWidth = curWidth + layerW + gapTextX;
      else {
        curWidth = curWidth + layerW + gapX;
        if (prevChkBlank == false && curX > initX) {
          //console.error('Change Line curWidth =>', curWidth);
          curX = curX + (gapX - gapTextX);
          curWidth = curWidth + (gapX - gapTextX);
          //console.error('Change Line curX =>', curX);
        }
      }
      prevChkBlank = tempInput.chkBlank;

      console.error("sWidget.x =>", curX);
      //console.error('sWidget.text =>', tempInput.text);
      wgt.moveTo(sWidget, curX, curY);
      ansLayerArr.push(sWidget);

      if (tempInput.chkBlank == true) {
        var inputAns = {
          layer: sWidget,
          correctText: tempInput.text,
          inputText: "",
          correctYN: "N",
          inputDragId: -1,
        };
        inputAnsArr.push(inputAns);
        //console.error('correct answer -> ', inputAns.correctText);
      }
    } else {
      curX = initX;
      curY = curY + gapY;
      curWidth = 0;
    }
  }
  set(typePrefix + "ansLayerArr", ansLayerArr);
  set(typePrefix + "inputAnsArr", inputAnsArr);
}

/**
 * 
    var dragAndDrop = { // 각 변수에 필요한 값 직접 설정
        typePrefix : '',             // ############## Type별 구분 명칭
        dragLabel : 'dragBox',          // ############## Widget 명
        initX: 418,                     // ############## dragBox Location init x 설정
        initY : 615,                    // ############## dragBox Location init y 설정
        min : 2,                        // ############## 최소 표시 박스 수 (값이 없어도 표시)
        max : 4,                       // ############## 최대 표시 박스 수
        spaceX : 26,                    // ############## Location 간격 x 설정
        spaceY : 0,                     // ############## Location 간격 y 설정
        colLength : 0,                  // ############## 자동 생성 unscramble 배열의 열 갯수 (0 설정 시 데이터 갯수에 따라 자동 생성)
        rowLength : 1,                  // ############## 자동 생성 unscramble 배열의 행 갯수 
        chkAutoCenterize : true,        // ############## 자동 생성 unscramble 배열 전체를 화면 가운데 맞춰 이동 : true, initX 좌표를 기준으로 생성 
        chkInputLocation : false,       // ############## Location 설정 방법 true : 직접 입력 (DataTable 설정 값), false : 간격 계산 설정 
        defaultVisibility : 'visible',       // ############## dragAndDrop layout 표시 설정 (Default : visible)
        defaultFontSize : 24,                 // ############## Font Size (Default : 24)   
        rowWidth : 779,
        chkFixedX : true,
        orginX : 412
    };  
 * 
 * */
function fn_setDragAndDrop($dragDrop) {
  var typePrefix = $dragDrop.typePrefix;
  var dragLabel = $dragDrop.dragLabel;
  var dragLabelBG = dragLabel + "BG";
  var initX = $dragDrop.initX;
  var initY = $dragDrop.initY;
  var min = $dragDrop.min;
  var max = $dragDrop.max;
  var spaceX = $dragDrop.spaceX;
  var spaceY = $dragDrop.spaceY;
  var colLength = $dragDrop.colLength;
  var rowLength = $dragDrop.rowLength;
  var chkAutoCenterize = $dragDrop.chkAutoCenterize;
  var chkInputLocation = $dragDrop.chkInputLocation;
  var defaultVisibility = $dragDrop.defaultVisibility;
  //var defaultFontSize       = $dragDrop.defaultFontSize;
  var chkFixedX = $dragDrop.chkFixedX;
  var rowWidth = $dragDrop.rowWidth;
  var originX = $dragDrop.originX;

  // file.set/get : overlay, page 간 변수 전달
  //{type:type, questionWord:questionWord, correctWord:correctWord};
  var dragDataArr = file.get(typePrefix + "dragAndDropDataArr");
  console.error(typePrefix);
  //console.error(dragDataArr);

  var sentenceType;
  var maxText;
  if (!isEmpty($dragDrop.sentenceType)) {
    sentenceType = $dragDrop.sentenceType; // 지금 $dragDrop.sentenceType는 unditinded.
    maxText = $dragDrop.maxText;
  } else {
    sentenceType = "word";
  }

  // tool array
  //
  var dragInfoArr = [];
  //var dragWidgetArr = [];
  var curWidth = wgt.get(getWidget(typePrefix + dragLabel), "w");
  var curHeight = wgt.get(getWidget(typePrefix + dragLabel), "h");

  if (true) {
    var qWordArr = [];
    var qFontSizeArr = [];
    var qFontColorArr = [];

    for (i = 0; i < dragDataArr.length; i++) {
      var uData = dragDataArr[i];
      var uText = uData.text;
      var uFontSize = uData.fontSize;
      var uFontColor = uData.fontColor;

      if ((sentenceType = "chunk")) {
        uText = uText.length > maxText ? uText.substr(0, maxText) : uText;
      } else {
        uText = uText;
        maxText = uText.length;
      }
      qWordArr.push(uText);
      qFontSizeArr.push(uFontSize);
      qFontColorArr.push(uFontColor);
    }

    //console.error('qWordArr : ', qWordArr)
    colLength = colLength == 0 ? qWordArr.length : colLength;
    var curX = initX;
    var curY = initY;
    var colCnt = 1;
    var rowCnt = 1;
    var boxCntInOneRow = [];
    boxCntInOneRow.push(0);

    // 보기 블록 최소 min개 ~ 최대 max개
    var WordCnt = qWordArr.length;
    if (WordCnt < min) WordCnt = min;
    else if (WordCnt > max) WordCnt = max;
    for (j = 0; j < WordCnt; j++) {
      var dragInfo = { widget: "", widgetBG: "", text: "", initX: 0, initY: 0 };
      var qWord = "";

      if (j >= qWordArr.length) qWord = "";
      else {
        qWord = qWordArr[j];
        qFontSize = qFontSizeArr[j];
        qFontColor = qFontColorArr[j];
      }
      var uWidgetBG = wgt.clone(getWidget(typePrefix + dragLabelBG));
      wgt.set(uWidgetBG, "label", typePrefix + dragLabelBG + "_" + (j + 1));
      var uWidget = wgt.clone(getWidget(typePrefix + dragLabel));
      var uWidgetLabel = typePrefix + dragLabel + "_" + (j + 1);
      wgt.set(uWidget, "label", uWidgetLabel);
      //var chkFixed = false;
      // if (qWord.indexOf('/') === 0)
      // {
      //     chkFixed = true;
      //     fn_changeStateWordBox(uWidget, 'Fixed');
      // } else {
      //     chkFixed = false;
      //     fn_changeStateWordBox(uWidget, 'Default');
      // }
      //console.error('dragDrop qWord : ', qWord)
      qWord = qWord.replace("/", "");
      fn_setWordBoxText(uWidget, qWord, qFontSize, qFontColor);
      fn_setWordBoxText(uWidgetBG, qWord, qFontSize, qFontColor);

      wgt.moveTo(uWidgetBG, curX, curY);
      wgt.moveTo(uWidget, curX, curY);

      //dragInfoArr 상에서 curIndex setting. 위치 변경시 curIndex 도 변경
      //wgt.setData(uWidget, 'curIndex', j);
      ////console.error('curIndex -> ', wgt.getData(uWidget, 'curIndex'));
      dragInfo.widget = uWidget;
      dragInfo.widgetBG = uWidgetBG;
      dragInfo.text = qWord;
      dragInfo.initX = curX;
      dragInfo.initY = curY;
      //dragInfo.chkFixed = chkFixed;

      dragInfoArr.push(dragInfo);
      //dragWidgetArr.push(uWidget);

      boxCntInOneRow[rowCnt - 1] = colCnt;

      if (colCnt >= colLength) {
        boxCntInOneRow.push(0);
        if (rowCnt >= rowLength) break;
        curX = initX;
        curY = curY + curHeight + spaceY;
        colCnt = 1;
        rowCnt++;
      } else {
        colCnt++;
        curX = curX + curWidth + spaceX;
      }
      //console.error('################################################# dragLabel : ', chkAutoCenterize);
    }

    // for (i = 0; i < dragWidgetArr.length; i++)
    // {
    //     var widget = dragWidgetArr[i];
    //     var x = wgt.get(widget, 'x');
    //     var cId = wgt.getData(widget, 'curIndex');
    //     //console.error('curIndex , x -> '. cId + ', ' + x);
    // }
    //console.error('fn_setdrag chkAutoCenterize : ', chkAutoCenterize);
    if (chkAutoCenterize === true) {
      if (chkFixedX == true) {
        var ii = 0;
        for (i = 0; i < boxCntInOneRow.length; i++) {
          //console.error('boxCntInOneRow ', boxCntInOneRow[i])
          var totalWidth =
            boxCntInOneRow[i] * curWidth + (boxCntInOneRow[i] - 1) * spaceX;
          var calcXCenter = (rowWidth - totalWidth) / 2;
          console.error(
            "calcXCenter, originX : ",
            calcXCenter + ", " + originX
          );
          calcXCenter = calcXCenter + originX;
          var rowY = initY + i * (curHeight + spaceY);
          for (j = 0; j < boxCntInOneRow[i]; j++) {
            var rowX = calcXCenter + j * (curWidth + spaceX);
            wgt.moveTo(dragInfoArr[ii].widget, rowX, rowY);
            wgt.moveTo(dragInfoArr[ii].widgetBG, rowX, rowY);
            dragInfoArr[ii].initX = rowX;
            dragInfoArr[ii].initY = rowY;

            ii++;
          }
        }
      } else {
        // widget 배열의 총 width (마지막 더해진 간격을 빼고 initX 도 빼주면 전체 폭)
        var totalWidth = colLength * curWidth + (colLength - 1) * spaceX;
        var calcXCenter = (rowWidth - totalWidth) / 2;
        var moveX = calcXCenter - initX;
        console.error(
          "totalWidth, calcXCenter, moveX : ",
          totalWidth + ", " + calcXCenter + ", " + moveX
        );
        for (k = 0; k < dragInfoArr.length; k++) {
          var widget = dragInfoArr[k].widget;
          wgt.moveBy(widget, moveX, 0);
          wgt.moveBy(dragInfoArr[k].widgetBG, moveX, 0);
          dragInfoArr[k].initX = dragInfoArr[k].initX + moveX;
          //console.error('dragWidgetArr[i] : ', wgt.get(widget, 'x'));
        }
      }
    }
  }
  set(typePrefix + "dragInfoArr", dragInfoArr);
  //set('dragWidgetArr',dragWidgetArr);
  set(typePrefix + "dragLabel", dragLabel);
  set(typePrefix + "checkCnt", 1);
}

function fn_checkDragDrop() {
  var typePrefix = fn_getTypePrefix();
  var checkCnt = get(typePrefix + "checkCnt");
  //console.error('fn_checkDragDrop checkCnt : ', checkCnt);
  var inputAnsArr = get(typePrefix + "inputAnsArr");
  //console.error('fn_checkDragDrop inputAnsArr : ', inputAnsArr);
  if (checkCnt == 1) {
    var chkAll = true;
    for (i = 0; i < inputAnsArr.length; i++) {
      var inputAns = inputAnsArr[i];
      var correctText = inputAns.correctText;
      if (inputAns.inputText == correctText) {
        fn_setDragDropTextColor(inputAns.layer, "#002bff");
        inputAnsArr[i].chkCorrect = true;
      } else {
        fn_setDragDropTextColor(inputAns.layer, "#ff2a2a");
        inputAnsArr[i].chkCorrect = false;
        chkAll = false;
      }
    }
    for (i = 0; i < inputAnsArr.length; i++) {
      if (inputAnsArr[i].chkCorrect == false) {
        fn_setDragDropTextColorDelay(inputAnsArr[i].layer, "#090909", "3000ms");
      } else {
        // wgt.set(inputAnsArr[i].layer, 'dragX', false);
        // wgt.set(inputAnsArr[i].layer, 'dragY', false);
      }
    }
    if (chkAll == false) {
      // wgt.set(getWidget(typePrefix + 'retryBtn'), 'visibility', 'visible');
      // wgt.set(getWidget(typePrefix + 'retryBtn'), 'visibility', 'hidden', '2000ms');
      // wgt.set(getWidget('disabledBox'), 'visibility', 'visible');
      // wgt.set(getWidget('disabledBox'), 'visibility', 'hidden', '3000ms');
      // wgt.changeState(getWidget(typePrefix + 'checkBtn'), 'Disabled');
      //var unscrambleWidgetArr = get(typePrefix + 'unscrambleWidgetArr');
      // for (i = 0; i < unscrambleWidgetArr.length; i++)
      //     wgt.
    } else {
      fn_setCorrectDragDrop();
    }
  } else {
    var chkAll = true;
    for (i = 0; i < inputAnsArr.length; i++) {
      var inputAns = inputAnsArr[i];
      var correctText = inputAnsArr[i].correctText;
      var tmpText = inputAnsArr[i].inputText;
      //if (inputAns.chkFixed == false)
      {
        if (tmpText == correctText) {
          fn_setDragDropTextColor(inputAns.layer, "#002bff");
          inputAnsArr[i].chkCorrect = true;
        } else {
          fn_setDragDropTextColorWithUnder(
            inputAns.layer,
            correctText,
            "#002bff",
            "#ff2a2a"
          );
          inputAnsArr[i].chkCorrect = false;
          chkAll = false;
        }
      }
    }
    if (chkAll == false) {
      fn_setInCorrectDragDrop();
    } else {
      fn_setCorrectDragDrop();
    }
  }
  if (checkCnt == 1) checkCnt++;
  set(typePrefix + "checkCnt", checkCnt);
  set(typePrefix + "chkDragDrop", true);
  set(typePrefix + "inputAnsArr", inputAnsArr);
}

function fn_setCorrectDragDrop() {
  var typePrefix = fn_getTypePrefix();
  set(typePrefix + "chkDragDrop", false);
  //wgt.set(getWidget('nextPageBtn'), 'visibility', 'visible');
  //wgt.changeState(getWidget(typePrefix + 'checkBtn'), 'Disabled');
  wgt.changeState(getWidget(typePrefix + "result"), "Correct");
  var Answer = get(typePrefix + "CorrectAnswer");
  //console.error('fn_setCorrect Answer : ', typePrefix + Answer);
  //console.error('fn_setCorrect TTSWordPlay : ', get(typePrefix + 'TTSWordPlay'));
  if (get(typePrefix + "TTSWordPlay") == "on") {
    file.set("TTSWord", Answer);
    fireCustomEvent("playTTSWord");
  }
}

function fn_setInCorrectDragDrop() {
  var typePrefix = fn_getTypePrefix();
  set(typePrefix + "chkDragDrop", false);
  //wgt.set(getWidget('nextPageBtn'), 'visibility', 'visible');
  //wgt.changeState(getWidget(typePrefix + 'checkBtn'), 'Disabled');
  wgt.changeState(getWidget(typePrefix + "result"), "Incorrect");
  var Answer = get(typePrefix + "CorrectAnswer");
  //console.error('fn_setCorrect Answer : ', Answer);
  if (get(typePrefix + "TTSWordPlay") == "on") {
    file.set("TTSWord", Answer);
    fireCustomEvent("playTTSWord");
  }
}

function fn_setDragDropText($uWidget, $text) {
  wgt.set(getWidget("wordDrop", $uWidget), "text", $text);
  wgt.set(getWidget("underWord", $uWidget), "visibility", "hidden");
}

function fn_setDragDropTextColor($uWidget, $textColor) {
  wgt.set(getWidget("wordDrop", $uWidget), "textColor", $textColor);
  wgt.set(getWidget("wordDrop", $uWidget), "textBold", true);
  wgt.set(getWidget("underWord", $uWidget), "visibility", "hidden");
}

function fn_setDragDropTextColorDelay($uWidget, $textColor, $delay) {
  wgt.set(getWidget("wordDrop", $uWidget), "textColor", $textColor, $delay);
  wgt.set(getWidget("underWord", $uWidget), "visibility", "hidden");
}

function fn_setDragDropTextColorWithUnder(
  $uWidget,
  $correctText,
  $correctTextColor,
  $incorrectTextColor
) {
  wgt.set(getWidget("wordDrop", $uWidget), "textColor", $incorrectTextColor);
  wgt.set(getWidget("wordDrop", $uWidget), "textBold", true);
  wgt.set(getWidget("underWord", $uWidget), "text", $correctText);
  wgt.set(getWidget("underWord", $uWidget), "textColor", $correctTextColor);
  wgt.set(getWidget("underWord", $uWidget), "visibility", "visible");
}

function fn_onDragStart($label) {
  //console.error('fn_onDragStart curIndex -> ', wgt.get(getWidget($label), 'label'));
  fn_changeStateWordBox(getWidget($label), "Select");
  wgt.zIndexTo(getWidget($label), "top");
}

/**
 *
 * var dragInfo = {widget:'', widgetBG:'', text:'', initX:0, initY:0};
 * set('dragInfoArr',dragInfoArr);
 * 
 * var inputAns = {layer:sWidget, correctText: tempInput.text, inputText: '', correctYN:'N', inputDragId: -1};
   inputAnsArr.push(inputAns);
 * */
function fn_onDragEnd($label) {
  var typePrefix = fn_getTypePrefix();
  //console.error('fn_onDragEnd');
  var dragObj = getWidget($label);
  var curIndex = $label.substr($label.indexOf("_") + 1, $label.length) - 1;
  var typePrefix = $label.substr(0, $label.indexOf("#") + 1);
  //console.error('############################## typePrefix -> ', typePrefix);
  //console.error('curIndex -> ', curIndex);

  //var dragInfo = {widget:'', widgetBG:'', text:'', initX:0, initY:0, chkFixed:false};
  var dragInfoArr = get(typePrefix + "dragInfoArr");

  //console.error('dragInfoArr -> ', dragInfoArr);
  //var dragWidgetArr = get('dragWidgetArr');
  var dragdragInfo = dragInfoArr[curIndex];
  var dragWidget = dragInfoArr[curIndex].widget;
  //console.error('curIndex dragWidget x -> ', wgt.get(dragWidget,'x'));

  for (i = 0; i < dragInfoArr.length; i++) {
    var tempdragInfo = dragInfoArr[i];
    var widget = tempdragInfo.widget;
    var x = wgt.get(widget, "x");
    var label = wgt.get(widget, "label");
    //console.error('label , x -> ', label + ', ' + x);
  }
  //Check Drop
  var chk = false;
  var inputAnsArr = get(typePrefix + "inputAnsArr");
  for (i = 0; i < inputAnsArr.length; i++) {
    var inputAns = inputAnsArr[i];

    var dropWidget = inputAns.layer;
    //console.error('inputAns ', inputAns);
    //console.error('dropWidget ', dropWidget);

    chk = fn_chkdragInfo(dragWidget, dropWidget);
    if (chk === true) {
      wgt.moveTo(
        dragObj,
        dragdragInfo.initX,
        dragdragInfo.initY,
        0,
        "ease 300ms"
      );
      if (inputAns.inputDragId < 0) {
        wgt.set(dragInfoArr[curIndex].widget, "visibility", "hidden");
      } else {
        wgt.set(
          dragInfoArr[inputAnsArr[i].inputDragId].widget,
          "visibility",
          "visible"
        );
        wgt.set(dragInfoArr[curIndex].widget, "visibility", "hidden");
      }
      inputAnsArr[i].inputDragId = curIndex;
      //console.error('inputAnsArr[i].widget label ', wgt.get(inputAnsArr[i].layer, 'label'));
      inputAnsArr[i].inputText = dragdragInfo.text;
      wgt.set(
        getWidget("wordDrop", inputAnsArr[i].layer),
        "text",
        dragdragInfo.text
      );
      wgt.set(
        getWidget("wordDrop", inputAnsArr[i].layer),
        "visibility",
        "visible"
      );
      wgt.set(getWidget("box", inputAnsArr[i].layer), "visibility", "hidden");
      break;
    }
  }
  //console.error('chk ', chk);
  if (chk === false) {
    wgt.moveTo(
      dragObj,
      dragdragInfo.initX,
      dragdragInfo.initY,
      0,
      "ease 300ms"
    );
  }

  fn_changeStateWordBox(getWidget($label), "Default");
  set(typePrefix + "dragInfoArr", dragInfoArr);
  set(typePrefix + "inputAnsArr", inputAnsArr);
  //wgt.changeState(getWidget(typePrefix + 'checkBtn'), 'Normal');
}

function fn_chkdragInfo(dragObj, dropObj) {
  //console.error('Check Drop dropdragInfo -> ', dragObj + ', ' + dropObj);
  var chk = false;
  var dr_xpos = wgt.get(dropObj, "x");
  var dr_mxXpos = wgt.get(dropObj, "x") + wgt.get(dropObj, "w");
  var dr_ypos = wgt.get(dropObj, "y");
  var dr_mxYpos = wgt.get(dropObj, "y") + wgt.get(dropObj, "h");
  var it_xpos = getPointerX();
  var it_ypos = getPointerY();

  var value = {
    it_xpos: it_xpos,
    dr_xpos: dr_xpos,
    dr_mxXpos: dr_mxXpos,
    it_ypos: it_ypos,
    dr_ypos: dr_ypos,
    dr_mxYpos: dr_mxYpos,
  };
  //console.error('Check Drop value -> ', value);
  if (it_xpos > dr_xpos && it_xpos < dr_mxXpos) {
    if (it_ypos > dr_ypos && it_ypos < dr_mxYpos) {
      chk = true;
    }
  }
  return chk;
}

function fn_changeStateWordBox($uWidget, $state) {
  wgt.changeState(getWidget("box", $uWidget), $state);
}

function fn_setWordBoxText($uWidget, $text, $fontSize, $fontColor) {
  wgt.set(getWidget("txt", $uWidget), "text", $text);
  wgt.set(getWidget("txt", $uWidget), "fontSize", $fontSize);
  wgt.set(getWidget("txt", $uWidget), "textColor", $fontColor);
}

// 넘어온 값이 빈값인지 체크합니다.
// !value 하면 생기는 논리적 오류를 제거하기 위해
// 명시적으로 value == 사용
// [], {} 도 빈값으로 처리
function isEmpty(value) {
  if (
    value == "" ||
    value == null ||
    value == undefined ||
    (value != null && typeof value == "object" && !Object.keys(value).length)
  ) {
    return true;
  } else {
    return false;
  }
}
