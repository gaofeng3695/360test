/**
 * 选人控件 js
 * 页面如果使用选人控件，需要进行如下代码编写
 * 1.直接在页面中引入person.js
 */

personchoose = {
	text : '',
	hidden : '',
	showPersonWindow : function(text, hidden) {
		this.text = document.getElementById(text);
		this.hidden = document.getElementById(hidden);
		top.getDlg(rootPath + "privilege/page/person.htm?r="+new Date().getTime()+"&pagelocation="
				+ window.document.location.href, "personChooseWindow", "选人", 700, 500, true);
	},
	setUser : function(text, hidden) {
		var user = '';
		var userid = '';
		var innerId = this.hidden.value + '';
		for (var i = 0; i < hidden.length; i++) {
			if (innerId.indexOf(hidden[i]) < 0 || innerId == '') {
				user += '<span style="cursor: pointer;" title="删除" onclick="personchoose.removePerson(\''
						+ text[i]
						+ '\', \''
						+ hidden[i]
						+ '\')">'
						+ text[i]
						+ '&nbsp;</span>';
				userid += ',' + hidden[i];
			}
		}
		if (innerId == '') {
			userid = userid.substring(1);
		}
		try {
			this.text.innerHTML += user;
		} catch (e) {
		}

		this.hidden.value += userid;
	},
	reSetUser : function() {
		this.text.innerHTML = '';
		this.hidden.value = '';
	},
	removePerson : function(name, userid) {
		this.text.innerHTML = this.text.innerHTML.replace(
				'<span style="cursor: pointer;" title="删除" onclick="personchoose.removePerson(\''
						+ name + '\', \'' + userid + '\')">' + name
						+ '&nbsp;</span>', '');
		if (this.hidden.value.indexOf(',') == -1) {
			this.hidden.value = this.hidden.value.replace(userid, '');
		} else {
			if (this.hidden.value.indexOf(userid) == 0) {
				this.hidden.value = this.hidden.value.replace(userid + ',', '');
			} else {
				this.hidden.value = this.hidden.value.replace(',' + userid, '');
			}
		}
	}
};

/**************************选人控件接口--结束************************************/
