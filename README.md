HTML5 canvas / JavaScript application to connect points with others.
For example, you can combine words or sentences with their equivalent in another language.
You have the ability to undo and redo connections paths as well as remove a specific one.
It is also possible to create, edit and delete content using the application.
There is a protection against SQL injection and XSS.

Requirements: web server with PHP, MariaDB / MySQL, HTML5 web browser.
Database username/password can be replaced in script/base.php.
Default database name is "elan" and an example (French/German words) can be loaded in script/relier_points.sql.
The example can also be found in demo/index.htm which does not need a web server.

Since it was a school project, you will find some French text and a lot of comments.
If you want to use this app in production so it can be used by different users, you will have to use a secure authentication with correct rights management and an authenticity token against CSRF.
I am available as freelance developer so I can provide you an updated version that is tested against more security vulnerabilities, you can contact me <a href="https://about.me/bhassenfratz">here</a>.
