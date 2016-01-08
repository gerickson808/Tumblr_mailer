var fs = require('fs');
var ejs = require('ejs');
// Authenticate via OAuth
var tumblr = require('tumblr.js');
var client = tumblr.createClient({
  consumer_key: 'qr6mvZUH9bQAYcIttJKH4Z50wKuAQgo5z05DCgqr25WEGBh2Q9',
  consumer_secret: 'jzE4Zzek2MTHAPDhjbxSDtVtV4dFb4MDPED8QDMimvfqx0N0QI',
  token: '2C81Qh6RcbhxRX4n1jRaOVVnH4YO28LDx7pEoar9rfoAmLM2zj',
  token_secret: 'ZNxZrdgQxY4jlDI95GVhyq1GUgEDrTWXRVyUcX9nimCHF0hqAU'
});

function csvParse(csvFile){
	var lineList = fs.readFileSync(csvFile, "utf8").split("\n");
	var keys = lineList[0].split(",");
	var contacts = [];
	for (var i = 1; i < lineList.length; i++){
		contactObject = {};
		info = lineList[i].split(",");
		for (var k = 0; k < keys.length; k++){
			contactObject[keys[k]] = info[k];
		}
		contacts[i-1] = contactObject;
	}
	return contacts;
}
var contacts = csvParse("friend_list.csv");
var template = fs.readFileSync("email_template.ejs", "utf8");
var latestPosts = [];

client.posts('futuristicspacegizmo.tumblr.com', function(err, blog){
	var today = Number(Date.now().toString().slice(0,10));
	blog.posts.forEach(function(post){
		if (today - post.timestamp <= 604800){
			latestPosts.push(post);
		};
	});
	generateEmails(contacts, latestPosts);
});

function generateEmails(contacts, latestPosts){
	contacts.forEach(function(contact){
		contact.latestPosts = latestPosts;
		var customizedTemplate = ejs.render(template, contact);
		console.log(customizedTemplate);
	});
}