{
	"translatorID": "e3f20f87-c841-43d7-9a32-3e525e52613f",
	"label": "WeiXinSogou",
	"creator": "Yun Liu",
	"target": "^https?://mp\\.weixin\\.qq\\.com/",
	"minVersion": "3.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsibv",
	"lastUpdated": "2018-05-06 21:10:45"
}

/**
	Copyright (c) 2018 Liu Yun
	
	This program is free software: you can redistribute it and/or
	modify it under the terms of the GNU Affero General Public License
	as published by the Free Software Foundation, either version 3 of
	the License, or (at your option) any later version.
	
	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
	Affero General Public License for more details.
	
	You should have received a copy of the GNU Affero General Public
	License along with this program. If not, see
	<http://www.gnu.org/licenses/>.
*/

/*
	This translator works on the articles from WeChat offical account websites.
	Thanks to the kind help from Philipp Zumstein.
*/

/*
	这个translator 在PC端阅读微信公众号时，可以抓取公众号文章。并做一个快照。
	其中url因为微信的时间戳导致的临时链接失效，所以url会返回到搜狗微信搜索该篇文章标题。
*/


function detectWeb(doc, url) {
		return "blogPost";
}


function scrape(doc, url) {
	var data = ZU.xpathText(doc, '//*[@id="meta_content"]');
	
	// Zotero.debug(data);
	var translator = Zotero.loadTranslator('web');
	// Embedded Metadata
	translator.setTranslator('951c027d-74ac-47d4-a107-9c3069ab7b48');
	//translator.setDocument(doc);
	
	translator.setHandler('itemDone', function (obj, items) {
		items.title = ZU.xpathText(doc, '//*[@id="activity-name"]').replace('\n','');
		// 获取公众号ID
		var data_list = data.replace(/\n/g, "").replace(/\s+/g, ',').split(',');
		// Zotero.debug(data_list);
		var ID_ind = data_list.indexOf("ID")
		var wxID = data_list[ID_ind+1];
		
		items.blogTitle = "微信公众号：" + ZU.trimInternal(doc.getElementById('post-user').textContent);
		
		items.rights = "WeChat ID: " + wxID;
		
		var authorNames = ZU.xpathText(doc, '//*[@id="meta_content"]/em[2]');
		
		// Zotero.debug(authorNames);
		
		items.creators.push({
			lastName: authorNames, 
			fieldMode:true,
			creatorType: "author"
		});
		
		items.date = ZU.xpathText(doc, '//*[@id="post-date"]');
	
		items.url = "http://weixin.sogou.com/weixin?type=2&query"+'='+items.title;
		// Z.debug();
		items.complete();
	});

	translator.getTranslatorObject(function(trans) {
		trans.itemType = "blogPost";
		trans.doWeb(doc, url);
	});
}



function doWeb(doc, url) {
	scrape(doc, url);
}



/** BEGIN TEST CASES **/
var testCases = [
	{
		"type": "web",
		"url": "https://mp.weixin.qq.com/s?__biz=MzIwMzE5MzQ1NQ==&mid=501820642&idx=1&sn=31f78e2e1cc0f27e699b04f9e78a4917&chksm=0ecea1e239b928f4be25d5f6c930e85fee8d10649675af371fbeee8c66f08ebc006c509efb51#rd",
		"items": [
			{
				"itemType": "blogPost",
				"title": "金属催化过程中的热电子",
				"creators": [
					{
						"lastName": "共进社刘云",
						"fieldMode": true,
						"creatorType": "author"
					}
				],
				"date": "2017-01-19",
				"blogTitle": "微信公众号：研之成理",
				"rights": "WeChat ID: rationalscience",
				"url": "http://weixin.sogou.com/weixin?type=2&query=                    金属催化过程中的热电子",
				"attachments": [
					{
						"title": "Snapshot"
					}
				],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	}
]
/** END TEST CASES **/
