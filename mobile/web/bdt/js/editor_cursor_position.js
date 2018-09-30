//光标移动到指定节点，指定位置
function setCursorPosition(node,postion){
	var el = node;
	if(el.nodeType ==1){
		el.focus();
	}
	var moveTo = postion;
	if($.support.msie){
		var rng;
		el.focus();
		rng = document.selection.createRange();
		if(moveTo == -1){
			moveTo = -el.innerText.length;
		}
		rng.moveStart('character', moveTo);
		var text = rng.text;
		for (var i = 0; i < el.innerText.length; i++) {
			if (el.innerText.substring(0, i + 1) == text.substring(text.length - i - 1, text.length)) {
				result = i + 1;
			}
		}
	}else{
		var range = document.createRange();
		range.selectNodeContents(el);
		if(postion != -1){
			range.setEnd(el,postion);
		}
		
		range.collapse(false);
		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	}
}

//光标到输入框末尾
function set_focus()
{
	var el = $("#edit-mark");
	el=el[0];  // jquery 对象转dom对象
	el.focus();
	if($.support.msie){
		var rng;
		el.focus();
		rng = document.selection.createRange();
		rng.moveStart('character', -el.innerText.length);
		var text = rng.text;
		for (var i = 0; i < el.innerText.length; i++) {
			if (el.innerText.substring(0, i + 1) == text.substring(text.length - i - 1, text.length)) {
				result = i + 1;
			}
		}
	}else{
		var range = document.createRange();
		range.selectNodeContents(el);
		range.collapse(false);
		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	}
}

