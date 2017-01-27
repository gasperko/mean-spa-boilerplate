angular.module('DashboardApp').run(['$templateCache', function($templateCache) {$templateCache.put('partials/404.html','<div class="container text-center">\r\n  <h1>404</h1>\r\n  <p>Page Not Found</p>\r\n</div>');
$templateCache.put('partials/app-badge.html','<span ng-show="value > 0" class="badge" ng-bind="value >= 1000 ? \'+999\' : value"></span>');
$templateCache.put('partials/apps.create.html','<div class="container">\r\n  <div class="panel">\r\n    <div class="panel-body">\r\n      <div ng-if="messages.error" role="alert" class="alert alert-danger">\r\n        <div ng-repeat="error in messages.error">{{error.msg}}</div>\r\n      </div>\r\n      <div ng-if="messages.success" role="alert" class="alert alert-success">\r\n        <div ng-repeat="success in messages.success">{{success.msg}}</div>\r\n      </div>\r\n      <form ng-submit="submit()" class="form-horizontal">\r\n        <legend>App Information</legend>\r\n        <div class="form-group">\r\n          <label for="name" class="col-sm-3">Name</label>\r\n          <div class="col-sm-7">\r\n            <input required type="name" name="name" id="name" class="form-control" ng-model="app.name">\r\n          </div>\r\n        </div>\r\n        <div class="form-group">\r\n          <label for="host" class="col-sm-3">Hosts</label>\r\n          <div class="col-sm-7">\r\n            <input type="text" placeholder="Separated by commas" name="host" id="host" class="form-control" ng-model="app.host">\r\n            <div class="alert alert-warning" role="alert">Not implemented yet.</div>\r\n          </div>\r\n        </div>\r\n        <div class="form-group">\r\n          <div class="col-sm-offset-3 col-sm-4">\r\n            <button type="submit" class="btn btn-success" ng-bind="buttonLabel"></button>\r\n          </div>\r\n        </div>\r\n      </form>\r\n    </div>\r\n  </div>\r\n</div>\r\n');
$templateCache.put('partials/apps.detail.html','<div class="container">\r\n\t<div class="panel">\r\n\t\t<div class="panel-body">\r\n\t\t\t<legend>My Apps</legend>\r\n\t\t\t<div class="bs-example">\r\n\t\t\t\t<div class="row">\r\n\t\t\t\t\t<div class="text-right col-xs-3 col-xs-offset-9">\r\n\t\t\t\t\t\t<a href="/apps/create" type="button" class="btn btn-primary">Create App</a>\r\n\t\t\t\t\t\t<br>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t\t<br>\r\n\t\t\t\t<table class="table table-bordered">\r\n\t\t\t\t\t<thead>\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<th>ID</th>\r\n\t\t\t\t\t\t\t<th>App Name</th>\r\n\t\t\t\t\t\t\t<th>Allowed Host</th>\r\n\t\t\t\t\t\t\t<th width="25%"></th>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t</thead>\r\n\t\t\t\t\t<tbody>\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<th scope="row">1</th>\r\n\t\t\t\t\t\t\t<td>Mark</td>\r\n\t\t\t\t\t\t\t<td>Otto</td>\r\n\t\t\t\t\t\t\t<td>\r\n\t\t\t\t\t\t\t\t<a href="#" type="button" class="btn btn-default">Edit</a>\r\n\t\t\t\t\t\t\t\t<button type="button" class="btn btn-danger">Remove</button>\r\n\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<th scope="row">2</th>\r\n\t\t\t\t\t\t\t<td>Jacob</td>\r\n\t\t\t\t\t\t\t<td>Thornton</td>\r\n\t\t\t\t\t\t\t<td>\r\n\t\t\t\t\t\t\t\t<a href="#" type="button" class="btn btn-default">Edit</a>\r\n\t\t\t\t\t\t\t\t<button type="button" class="btn btn-danger">Remove</button>\r\n\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t</tbody>\r\n\t\t\t\t</table>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>');
$templateCache.put('partials/contact.html','<div class="container">\r\n  <div class="panel">\r\n    <div class="panel-heading">\r\n      <h3 class="panel-title">Contact Form</h3>\r\n    </div>\r\n    <div class="panel-body">\r\n      <div ng-if="messages.error" role="alert" class="alert alert-danger">\r\n        <div ng-repeat="error in messages.error">{{error.msg}}</div>\r\n      </div>\r\n      <div ng-if="messages.success" role="alert" class="alert alert-success">\r\n        <div ng-repeat="success in messages.success">{{success.msg}}</div>\r\n      </div>\r\n      <form ng-submit="sendContactForm()" class="form-horizontal">\r\n        <div class="form-group">\r\n          <label for="name" class="col-sm-2">Name</label>\r\n          <div class="col-sm-8">\r\n            <input type="text" name="name" id="name" class="form-control" ng-model="contact.name" autofocus>\r\n          </div>\r\n        </div>\r\n        <div class="form-group">\r\n          <label for="email" class="col-sm-2">Email</label>\r\n          <div class="col-sm-8">\r\n            <input type="email" name="email" id="email" class="form-control" ng-model="contact.email">\r\n          </div>\r\n        </div>\r\n        <div class="form-group">\r\n          <label for="message" class="col-sm-2">Body</label>\r\n          <div class="col-sm-8">\r\n            <textarea name="message" id="message" rows="7" class="form-control" ng-model="contact.message"></textarea>\r\n          </div>\r\n        </div>\r\n        <div class="form-group">\r\n          <div class="col-sm-offset-2 col-sm-8">\r\n            <button type="submit" class="btn btn-success">Send</button>\r\n          </div>\r\n        </div>\r\n      </form>\r\n    </div>\r\n  </div>\r\n</div>');
$templateCache.put('partials/custom-events.detail.html','<div>\r\n\t<div class="text-right">\r\n\t\t<button clipboard text="detailedEvent | json" on-copied="btnCopyText = \'Copied!\'" on-error="btnCopyText = \'Error!\'" class="btn btn-default" ng-bind="btnCopyText || \'Copy to clipboard\'"></button>\r\n\t\t&nbsp;\r\n\t\t<button class="btn btn-default" ng-click="closeModal()">Close</button>\r\n\t</div>\r\n\t<pre>{{ detailedEvent | json }}</pre>\r\n</div>');
$templateCache.put('partials/custom-events.html','<div class="row">\r\n\t<div class="page-header">\r\n\t\t<div class="col-xs-6">\r\n\t\t\t<h1 class="">\r\n\t\t\t\tCustom Events\r\n\t\t\t</h1>\r\n\t\t</div>\r\n\t\t<div class="col-xs-6">\r\n\t\t\t<br>\r\n\t\t\t<div class="row form-group">\r\n\t\t\t\t<input class="form-control" placeholder="Search.." ng-model="globalSearchTerm"type="text" />\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n<!-- /.row -->\r\n<script type="text/ng-template" id="bulkSelection.html">\r\n    <input type="checkbox" ng-disabled="vm.selectedAllPages" ng-change="toggleAll()" ng-model="vm.selectedAll" id="select_all" class="select-all" value="" />\r\n</script>\r\n<script type="text/ng-template" id="bulkActions.html">\r\n    <div class="text-center">\r\n        <div class="btn-group">\r\n            <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">\r\n                Actions\r\n                <span class="caret"></span>\r\n            </button>\r\n            <ul class="dropdown-menu pull-right" role="menu">\r\n                <li>\r\n                \t<a ng-click="bulkAction(\'read\')" href="javascript:void(0);">Mark as read</a>\r\n            \t</li>\r\n            \t<li>\r\n                \t<a ng-click="bulkAction(\'unread\')" href="javascript:void(0);">Mark as unread</a>\r\n            \t</li>\r\n            \t<li>\r\n                \t<a ng-click="bulkAction(\'delete\')" href="javascript:void(0);">Delete</a>\r\n            \t</li>\r\n            </ul>\r\n        </div>\r\n    </div>\r\n</script>\r\n<div class="row">\r\n\t<div class="col-lg-12">\r\n\t\t<div class="panel panel-default">\r\n\t\t\t<!-- /.panel-heading -->\r\n\t\t\t<div class="panel-body">\r\n\t\t\t\t<div ng-show="stats.events > 0 && !closedUnreadMsg" class="alert alert-info">\r\n\t\t\t\t\t<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp;\r\n\t\t\t\t\t<strong>{{stats.events}}</strong> new Events!\r\n\t\t\t\t\t<button ng-click="closedUnreadMsg = true" type="button" class="close" data-dismiss="alert" aria-hidden="true">\xD7</button>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class="alert alert-warning">\r\n                    <strong>{{ vm.selectedAllPages ? gridTotal : selecteds.length}}/{{gridTotal}}</strong> items selected.\r\n                    <a ng-show="!vm.selectedAllPages" ng-click="toggleSelectAllPages($event)" href="#" class="alert-link">Select all pages</a>\r\n                    <a ng-show="vm.selectedAllPages" ng-click="toggleSelectAllPages($event)" href="#" class="alert-link">Unselect all</a>\r\n                </div>\r\n\t\t\t\t<table class="resp table table-bordered table-hover" ng-table="gridEvents" show-filter="false">\r\n\t\t\t\t\t<tr ng-repeat="event in $data" ng-class="{active: !event._new}">\r\n\t\t\t\t\t\t<td header="\'bulkSelection.html\'" class="center center-y">\r\n\t\t\t\t\t\t\t<input ng-change="toggleSelection(event)" ng-model="event.isSelected" ng-disabled="vm.selectedAllPages" type="checkbox" />\r\n\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t<td class="break-line" title="\'Name\'" sortable="\'eventName\'" ng-bind="event.eventName"></td>\r\n\t\t\t\t\t\t<td class="break-line" title="\'Created Date\'" sortable="\'createdAt\'" ng-bind="event.createdAt | AppDate"></td>\r\n\t\t\t\t\t\t<td class="break-line center" title="\'Status\'" sortable="\'_new\'">\r\n\t\t\t\t\t\t\t<i ng-show="!event._new" class="fa fa-envelope-open-o" aria-hidden="true"></i>\r\n\t\t\t\t\t\t\t<i ng-show="event._new" class="fa fa-envelope-o" aria-hidden="true"></i>\r\n\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t<td header="\'bulkActions.html\'" class="center center-y">\r\n\t\t\t\t\t\t\t<button title="Show details" ng-click="showDetails(event)" type="button" class="btn btn-sm btn-primary">\r\n\t\t\t\t\t\t\t\t<i class="fa fa-reorder">\r\n\t\t\t\t\t\t\t\t</i>\r\n\t\t\t\t\t\t\t</button>\r\n\t\t\t\t\t\t\t<button\r\n\t\t\t\t\t\t\ttitle="Delete" type="button" ng-click="remove(event)" class="btn btn-sm btn-danger">\r\n\t\t\t\t\t\t\t\t<i class="fa fa-trash">\r\n\t\t\t\t\t\t\t\t</i>\r\n\t\t\t\t\t\t\t</button>\r\n\t\t\t\t\t\t</td>\r\n\t\t\t\t\t</tr>\r\n\t\t\t\t</table>\r\n\t\t\t\t<!-- /.table-responsive -->\r\n\t\t\t</div>\r\n\t\t\t<!-- /.panel-body -->\r\n\t\t</div>\r\n\t\t<!-- /.panel -->\r\n\t</div>\r\n\t<!-- /.col-lg-12 -->\r\n</div>\r\n');
$templateCache.put('partials/errors.detail.html','<div>\r\n\t<div class="text-right">\r\n\t\t<button clipboard text="detailedError | json" on-copied="btnCopyText = \'Copied!\'" on-error="btnCopyText = \'Error!\'" class="btn btn-default" ng-bind="btnCopyText || \'Copy to clipboard\'"></button>\r\n\t\t&nbsp;\r\n\t\t<button class="btn btn-default" ng-click="closeModal()">Close</button>\r\n\t</div>\r\n\t<pre>{{ detailedError | json }}</pre>\r\n</div>');
$templateCache.put('partials/errors.html','<div class="row">\r\n\t<div class="page-header">\r\n\t\t<div class="col-xs-6">\r\n\t\t\t<h1 class="">\r\n\t\t\t\tErrors\r\n\t\t\t</h1>\r\n\t\t</div>\r\n\t\t<div class="col-xs-6">\r\n\t\t\t<br>\r\n\t\t\t<div class="row form-group">\r\n\t\t\t\t<input class="form-control" placeholder="Search.." ng-model="globalSearchTerm"type="text" />\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n<!-- /.row -->\r\n<script type="text/ng-template" id="bulkSelection.html">\r\n    <input type="checkbox" ng-disabled="vm.selectedAllPages" ng-change="toggleAll()" ng-model="vm.selectedAll" id="select_all" value="" />\r\n</script>\r\n<script type="text/ng-template" id="bulkActions.html">\r\n    <div class="text-center">\r\n        <div class="btn-group">\r\n            <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">\r\n                Actions\r\n                <span class="caret"></span>\r\n            </button>\r\n            <ul class="dropdown-menu pull-right" role="menu">\r\n                <li>\r\n                \t<a ng-click="bulkAction(\'read\')" href="javascript:void(0);">Mark as read</a>\r\n            \t</li>\r\n            \t<li>\r\n                \t<a ng-click="bulkAction(\'unread\')" href="javascript:void(0);">Mark as unread</a>\r\n            \t</li>\r\n            \t<li>\r\n                \t<a ng-click="bulkAction(\'delete\')" href="javascript:void(0);">Delete</a>\r\n            \t</li>\r\n            </ul>\r\n        </div>\r\n    </div>\r\n</script>\r\n<div class="row">\r\n\t<div class="col-lg-12">\r\n\t\t<div class="panel panel-default">\r\n\t\t\t<!-- /.panel-heading -->\r\n\t\t\t<div class="panel-body">\r\n\t\t\t\t<div ng-show="stats.errors > 0 && !closedUnreadMsg" class="alert alert-info">\r\n\t\t\t\t\t<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp;\r\n\t\t\t\t\t<strong>{{stats.errors}}</strong> new Errors!\r\n\t\t\t\t\t<button ng-click="closedUnreadMsg = true" type="button" class="close" data-dismiss="alert" aria-hidden="true">\xD7</button>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class="alert alert-warning">\r\n                    <strong>{{ vm.selectedAllPages ? gridTotal : selecteds.length}}/{{gridTotal}}</strong> items selected.\r\n                    <a ng-show="!vm.selectedAllPages" ng-click="toggleSelectAllPages($event)" href="#" class="alert-link">Select all pages</a>\r\n                    <a ng-show="vm.selectedAllPages" ng-click="toggleSelectAllPages($event)" href="#" class="alert-link">Unselect all</a>\r\n                </div>\r\n\t\t\t\t<table class="resp table table-bordered table-hover" ng-table="gridErrors" show-filter="false">\r\n\t\t\t\t\t<tr ng-repeat="error in $data" ng-class="{active: !error._new}">\r\n\t\t\t\t\t\t<td header="\'bulkSelection.html\'" class="center center-y">\r\n\t\t\t\t\t\t\t<input ng-change="toggleSelection(error)" ng-model="error.isSelected" ng-disabled="vm.selectedAllPages" type="checkbox" />\r\n\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t<td class="break-line" title="\'Message\'" sortable="\'data.message\'" ng-bind="error.message"></td>\r\n\t\t\t\t\t\t<td class="break-line" title="\'URL\'"sortable="\'url\'" ng-bind="error.url"></td>\r\n\t\t\t\t\t\t<td class="break-line" title="\'Date\'" sortable="\'data.date\'" ng-bind="error.date | AppDate"></td>\r\n\t\t\t\t\t\t<td class="break-line" title="\'Browser\'" ng-bind="error.browser + \' \' +( error.browserVersion || \'\')"></td>\r\n\t\t\t\t\t\t<td class="break-line" title="\'OS\'" ng-bind="error.os"></td>\r\n\t\t\t\t\t\t<td class="break-line center" title="\'Status\'" sortable="\'_new\'">\r\n\t\t\t\t\t\t\t<i ng-show="!error._new" class="fa fa-envelope-open-o" aria-hidden="true"></i>\r\n\t\t\t\t\t\t\t<i ng-show="error._new" class="fa fa-envelope-o" aria-hidden="true"></i>\r\n\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t<td header="\'bulkActions.html\'" class="center center-y">\r\n\t\t\t\t\t\t\t<button title="Show details"type="button" ng-click="showDetails(error)" class="btn btn-sm btn-primary">\r\n\t\t\t\t\t\t\t\t<i class="fa fa-reorder">\r\n\t\t\t\t\t\t\t\t</i>\r\n\t\t\t\t\t\t\t</button>\r\n\t\t\t\t\t\t\t<button title="Delete" type="button" ng-click="remove(error)" class="btn btn-sm btn-danger">\r\n\t\t\t\t\t\t\t\t<i class="fa fa-trash">\r\n\t\t\t\t\t\t\t\t</i>\r\n\t\t\t\t\t\t\t</button>\r\n\t\t\t\t\t\t</td>\r\n\t\t\t\t\t</tr>\r\n\t\t\t\t</table>\r\n\t\t\t\t<!-- /.table-responsive -->\r\n\t\t\t</div>\r\n\t\t\t<!-- /.panel-body -->\r\n\t\t</div>\r\n\t\t<!-- /.panel -->\r\n\t</div>\r\n\t<!-- /.col-lg-12 -->\r\n</div>\r\n');
$templateCache.put('partials/footer.html','');
$templateCache.put('partials/forgot.html','<div class="container">\r\n  <div class="panel">\r\n    <div class="panel-body">\r\n      <div ng-if="messages.error" role="alert" class="alert alert-danger">\r\n        <div ng-repeat="error in messages.error">{{error.msg}}</div>\r\n      </div>\r\n      <div ng-if="messages.success" role="alert" class="alert alert-success">\r\n        <div ng-repeat="success in messages.success">{{success.msg}}</div>\r\n      </div>\r\n      <form ng-submit="forgotPassword()">\r\n        <legend>Forgot Password</legend>\r\n        <div class="form-group">\r\n          <p>Enter your email address below and we\'ll send you password reset instructions.</p>\r\n          <label for="email">Email</label>\r\n          <input type="email" name="email" id="email" placeholder="Email" class="form-control" ng-model="user.email" autofocus>\r\n        </div>\r\n        <button type="submit" class="btn btn-success">Reset Password</button>\r\n      </form>\r\n    </div>\r\n  </div>\r\n</div>');
$templateCache.put('partials/home.html','<div class="row">\r\n    <div class="col-lg-12">\r\n        <h1 class="page-header">Dashboard</h1>\r\n    </div>\r\n    <!-- /.col-lg-12 -->\r\n</div>\r\n<!-- /.row -->\r\n<div class="row">\r\n    \r\n    <div class="col-lg-6 col-md-6">\r\n        <div class="panel panel-primary">\r\n            <div class="panel-heading">\r\n                <div class="row">\r\n                    <div class="col-xs-3">\r\n                        <i class="fa fa-tasks fa-5x"></i>\r\n                    </div>\r\n                    <div class="col-xs-9 text-right">\r\n                        <div class="huge" ng-bind="stats.events"></div>\r\n                        <div>New Custom Events!</div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <a href="#/custom-events">\r\n                <div class="panel-footer">\r\n                    <span class="pull-left">View Details</span>\r\n                    <span class="pull-right">\r\n                        <i class="fa fa-arrow-circle-right"></i>\r\n                    </span>\r\n                    <div class="clearfix"></div>\r\n                </div>\r\n            </a>\r\n        </div>\r\n    </div>\r\n    <div class="col-lg-6 col-md-6">\r\n        <div class="panel panel-red">\r\n            <div class="panel-heading">\r\n                <div class="row">\r\n                    <div class="col-xs-3">\r\n                        <i class="fa fa-exclamation-triangle fa-5x"></i>\r\n                    </div>\r\n                    <div class="col-xs-9 text-right">\r\n                        <div class="huge" ng-bind="stats.errors"></div>\r\n                        <div>New Errors!</div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <a href="#/errors">\r\n                <div class="panel-footer">\r\n                    <span class="pull-left">View Details</span>\r\n                    <span class="pull-right">\r\n                        <i class="fa fa-arrow-circle-right"></i>\r\n                    </span>\r\n                    <div class="clearfix"></div>\r\n                </div>\r\n            </a>\r\n        </div>\r\n    </div>\r\n</div>\r\n<!-- /.row -->\r\n<div class="row">\r\n    <div class="col-lg-8">\r\n        <div class="panel panel-default">\r\n            <div class="panel-heading">\r\n                <i class="fa fa-code fa-fw"></i>\r\n                Snippet code\r\n                <div class="pull-right">\r\n                    <button clipboard text="textToCopy" on-copied="success()" on-error="fail(err)" class="btn btn-xs btn-default" ng-bind="btnCopyText"></button>\r\n                </div>\r\n            </div>\r\n            <!-- /.panel-heading -->\r\n            <div class="panel-body">\r\n                <div class="snippet-code" ui-ace="aceOption" ng-model="textToCopy"></div>\r\n            </div>\r\n            <!-- /.panel-body --> </div>\r\n        <!-- /.panel -->\r\n        <!-- /.panel --> \r\n    </div>\r\n    <!-- /.col-lg-8 -->\r\n</div>\r\n<!-- /.row -->');
$templateCache.put('partials/login.html','<div class="container login-container">\r\n  <div class="panel">\r\n    <div class="panel-body">\r\n      <div ng-if="messages.error" role="alert" class="alert alert-danger">\r\n        <div ng-repeat="error in messages.error">{{error.msg}}</div>\r\n      </div>\r\n      <form ng-submit="login()">\r\n        <legend>Log In</legend>\r\n        <div class="form-group">\r\n          <label for="email">Email</label>\r\n          <input type="email" name="email" id="email" placeholder="Email" class="form-control" ng-model="user.email" autofocus>\r\n        </div>\r\n        <div class="form-group">\r\n          <label for="password">Password</label>\r\n          <input type="password" name="password" id="password" placeholder="Password" class="form-control" ng-model="user.password">\r\n        </div>\r\n        <div class="form-group"><a href="/forgot"><strong>Forgot your password?</strong></a></div>\r\n        <button type="submit" class="btn btn-success">Log in</button>\r\n      </form>\r\n      <div class="hr-title"><span>or</span></div>\r\n      <div class="btn-toolbar text-center">\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <p class="text-center">\r\n    Don\'t have an account? <a href="/signup"><strong>Sign up</strong></a>\r\n  </p>\r\n</div>\r\n');
$templateCache.put('partials/nav.html','<!-- Navigation -->\n<nav ng-controller="HeaderCtrl" class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0">\n\t<div class="navbar-header">\n\t\t<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">\n\t\t\t<span class="sr-only">Toggle navigation</span>\n\t\t\t<span class="icon-bar"></span>\n\t\t\t<span class="icon-bar"></span>\n\t\t\t<span class="icon-bar"></span>\n\t\t</button>\n\t\t<a class="navbar-brand" href="/">JSEL <span ng-if="app.name" ng-bind="\'- \' + app.name"></span></a>\n\t</div>\n\t<!-- /.navbar-header -->\n\n\t<ul class="nav navbar-top-links navbar-right">\n\t\t<!-- /.dropdown -->\n\t\t<li class="dropdown">\n\t\t\t<a class="dropdown-toggle" data-toggle="dropdown" href="javascript:void(0)">\n\t\t\t\t<i class="fa fa-user fa-fw"></i>\n\t\t\t\t<i class="fa fa-caret-down"></i>\n\t\t\t</a>\n\t\t\t<ul class="dropdown-menu dropdown-user">\n\t\t\t\t<li>\n\t\t\t\t\t<a href="/account">\n\t\t\t\t\t\t<i class="fa fa-user fa-fw"></i>\n\t\t\t\t\t\tMy Account\n\t\t\t\t\t</a>\n\t\t\t\t</li>\n\t\t\t\t<li class="divider"></li>\n\t\t\t\t<li>\n\t\t\t\t\t<a ng-click="logout()" href="#">\n\t\t\t\t\t\t<i class="fa fa-sign-out fa-fw"></i>\n\t\t\t\t\t\tLogout\n\t\t\t\t\t</a>\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t\t<!-- /.dropdown-user -->\n\t\t</li>\n\t\t<!-- /.dropdown -->\n\t</ul>\n\t<!-- /.navbar-top-links -->\n\n\t<div class="navbar-default sidebar" role="navigation">\n\t\t<div class="sidebar-nav navbar-collapse">\n\t\t\t<ul class="nav" id="side-menu">\n\t\t\t\t<li>\n\t\t\t\t\t<a ng-class="{ active: isActive(\'/\')}" href="#/">\n\t\t\t\t\t\t<i class="fa fa-dashboard fa-fw"></i>\n\t\t\t\t\t\tDashboard\n\t\t\t\t\t</a>\n\t\t\t\t</li>\n\t\t\t\t<li>\n\t\t\t\t\t<a ng-class="{ active: isActive(\'/triggers\')}" href="#/triggers">\n\t\t\t\t\t\t<i class="fa fa-bolt fa-fw"></i>\n\t\t\t\t\t\tTriggers\n\t\t\t\t\t</a>\n\t\t\t\t</li>\n\t\t\t\t<li>\n\t\t\t\t\t<a ng-class="{ active: isActive(\'/custom-events\')}" href="#/custom-events">\n\t\t\t\t\t\t<i class="fa fa-tasks fa-fw"></i>\n\t\t\t\t\t\tCustom Events\n\t\t\t\t\t\t<span app-badge data-value="stats.events"></span>\n\t\t\t\t\t</a>\n\t\t\t\t</li>\n\t\t\t\t<li>\n\t\t\t\t\t<a ng-class="{ active: isActive(\'/errors\')}" href="#/errors">\n\t\t\t\t\t\t<i class="fa fa-exclamation-triangle fa-fw"></i>\n\t\t\t\t\t\tErrors\n\t\t\t\t\t\t<span app-badge data-value="stats.errors"></span>\n\t\t\t\t\t</a>\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t</div>\n\t\t<!-- /.sidebar-collapse -->\n\t</div>\n\t<!-- /.navbar-static-side -->\n</nav>\n');
$templateCache.put('partials/profile.html','<div class="container">\r\n  <div class="panel">\r\n    <div class="panel-body">\r\n      <div ng-if="messages.error" role="alert" class="alert alert-danger">\r\n        <div ng-repeat="error in messages.error">{{error.msg}}</div>\r\n      </div>\r\n      <div ng-if="messages.success" role="alert" class="alert alert-success">\r\n        <div ng-repeat="success in messages.success">{{success.msg}}</div>\r\n      </div>\r\n      <form ng-submit="updateProfile()" class="form-horizontal">\r\n        <legend>Profile Information</legend>\r\n        <div class="form-group">\r\n          <label for="email" class="col-sm-3">Email</label>\r\n          <div class="col-sm-7">\r\n            <input type="email" name="email" id="email" class="form-control" ng-model="profile.email">\r\n          </div>\r\n        </div>\r\n        <div class="form-group">\r\n          <label for="name" class="col-sm-3">Name</label>\r\n          <div class="col-sm-7">\r\n            <input type="text" name="name" id="name" class="form-control" ng-model="profile.name">\r\n          </div>\r\n        </div>\r\n        <div class="form-group">\r\n          <label class="col-sm-3">Gender</label>\r\n          <div class="col-sm-4">\r\n            <label class="radio-inline radio col-sm-4">\r\n              <input type="radio" name="gender" value="male" ng-checked="profile.gender === \'male\'"><span>Male</span>\r\n            </label>\r\n            <label class="radio-inline col-sm-4">\r\n              <input type="radio" name="gender" value="female" ng-checked="profile.gender === \'female\'"><span>Female</span>\r\n            </label>\r\n          </div>\r\n        </div>\r\n        <div class="form-group">\r\n          <label for="location" class="col-sm-3">Location</label>\r\n          <div class="col-sm-7">\r\n            <input type="text" name="location" id="location" class="form-control" ng-model="profile.location">\r\n          </div>\r\n        </div>\r\n        <div class="form-group">\r\n          <label for="website" class="col-sm-3">Website</label>\r\n          <div class="col-sm-7">\r\n            <input type="text" name="website" id="website" class="form-control" ng-model="profile.website">\r\n          </div>\r\n        </div>\r\n        <div class="form-group">\r\n          <label class="col-sm-3">Gravatar</label>\r\n          <div class="col-sm-4">\r\n            <img ng-src="{{profile.gravatar}}" class="profile" width="100" height="100">\r\n          </div>\r\n        </div>\r\n        <div class="form-group">\r\n          <div class="col-sm-offset-3 col-sm-4">\r\n            <button type="submit" class="btn btn-success">Update Profile</button>\r\n          </div>\r\n        </div>\r\n      </form>\r\n    </div>\r\n  </div>\r\n  <div class="panel">\r\n    <div class="panel-body">\r\n      <form ng-submit="changePassword()" class="form-horizontal">\r\n        <legend>Change Password</legend>\r\n        <div class="form-group">\r\n          <label for="password" class="col-sm-3">New Password</label>\r\n          <div class="col-sm-7">\r\n            <input type="password" name="password" id="password" class="form-control" ng-model="profile.password">\r\n          </div>\r\n        </div>\r\n        <div class="form-group">\r\n          <label for="confirm" class="col-sm-3">Confirm Password</label>\r\n          <div class="col-sm-7">\r\n            <input type="password" name="confirm" id="confirm" class="form-control" ng-model="profile.confirm">\r\n          </div>\r\n        </div>\r\n        <div class="form-group">\r\n          <div class="col-sm-4 col-sm-offset-3">\r\n            <button type="submit" class="btn btn-success">Change Password</button>\r\n          </div>\r\n        </div>\r\n      </form>\r\n    </div>\r\n  </div>\r\n  <div class="panel">\r\n    <div class="panel-body">\r\n      <div class="form-horizontal">\r\n        <legend>Linked Accounts</legend>\r\n        <div class="form-group">\r\n          <div class="col-sm-offset-3 col-sm-4">\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class="panel">\r\n    <div class="panel-body">\r\n      <form ng-submit="deleteAccount()" class="form-horizontal">\r\n        <legend>Delete Account</legend>\r\n        <div class="form-group">\r\n          <p class="col-sm-offset-3 col-sm-9">You can delete your account, but keep in mind this action is irreversible.</p>\r\n          <div class="col-sm-offset-3 col-sm-9">\r\n            <button type="submit" class="btn btn-danger">Delete my account</button>\r\n          </div>\r\n        </div>\r\n      </form>\r\n    </div>\r\n  </div>\r\n</div>\r\n');
$templateCache.put('partials/reset.html','<div class="container">\r\n  <div class="panel">\r\n    <div class="panel-body">\r\n      <div ng-if="messages.error" role="alert" class="alert alert-danger">\r\n        <div ng-repeat="error in messages.error">{{error.msg}}</div>\r\n      </div>\r\n      <div ng-if="messages.success" role="alert" class="alert alert-success">\r\n        <div ng-repeat="success in messages.success">{{success.msg}}</div>\r\n      </div>\r\n        <form ng-submit="resetPassword()">\r\n          <legend>Reset Password</legend>\r\n          <div class="form-group">\r\n            <label for="password">New Password</label>\r\n            <input type="password" name="password" id="password" placeholder="New password" class="form-control" ng-model="user.password" autofocus>\r\n          </div>\r\n          <div class="form-group">\r\n            <label for="confirm">Confirm Password</label>\r\n            <input type="password" name="confirm" id="confirm" placeholder="Confirm password" class="form-control" ng-model="user.confirm">\r\n          </div>\r\n          <div class="form-group">\r\n            <button type="submit" class="btn btn-success">Change Password</button>\r\n          </div>\r\n        </form>\r\n    </div>\r\n  </div>\r\n</div>\r\n');
$templateCache.put('partials/signup.html','<div class="container login-container">\r\n  <div class="panel">\r\n    <div class="panel-body">\r\n      <div ng-if="messages.error" role="alert" class="alert alert-danger">\r\n        <div ng-repeat="error in messages.error">{{error.msg}}</div>\r\n      </div>\r\n      <form ng-submit="signup()">\r\n        <legend>Create an account</legend>\r\n        <div class="form-group">\r\n          <label for="name">Name</label>\r\n          <input type="text" name="name" id="name" placeholder="Name" class="form-control" ng-model="user.name" autofocus>\r\n        </div>\r\n        <div class="form-group">\r\n          <label for="email">Email</label>\r\n          <input type="email" name="email" id="email" placeholder="Email" class="form-control" ng-model="user.email">\r\n        </div>\r\n        <div class="form-group">\r\n          <label for="password">Password</label>\r\n          <input type="password" name="password" id="password" placeholder="Password" class="form-control" ng-model="user.password">\r\n        </div>\r\n        <div class="form-group">\r\n          <small class="text-muted">By signing up, you agree to the <a href="/">Terms of Service</a>.</small>\r\n        </div>\r\n        <button type="submit" class="btn btn-success">Create an account</button>\r\n      </form>\r\n      <div class="hr-title"><span>or</span></div>\r\n      <div class="btn-toolbar text-center">\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <p class="text-center">\r\n    Already have an account? <a href="/login"><strong>Log in</strong></a>\r\n  </p>\r\n</div>\r\n');
$templateCache.put('partials/triggers.html','<div class="row">\r\n\t<div class="page-header">\r\n\t\t<div class="col-xs-6">\r\n\t\t\t<h1 class="">\r\n\t\t\t\tTriggers\r\n\t\t\t</h1>\r\n\t\t</div>\r\n\t\t<div class="col-xs-6">\r\n\t\t\t<br>\r\n\t\t\t<div class="row form-group">\r\n\t\t\t\t<input class="form-control" placeholder="Search.." ng-model="globalSearchTerm"type="text" />\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n<!-- /.row -->\r\n<script type="text/ng-template" id="bulkSelection.html">\r\n    <input type="checkbox" ng-disabled="vm.selectedAllPages" ng-change="toggleAll()" ng-model="vm.selectedAll" id="select_all" value="" />\r\n</script>\r\n<script type="text/ng-template" id="bulkActions.html">\r\n    <div class="text-center">\r\n        <div class="btn-group">\r\n            <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">\r\n                Actions\r\n                <span class="caret"></span>\r\n            </button>\r\n            <ul class="dropdown-menu pull-right" role="menu">\r\n            \t<li>\r\n                \t<a ng-click="bulkAction(\'delete\')" href="javascript:void(0);">Delete</a>\r\n            \t</li>\r\n            </ul>\r\n        </div>\r\n    </div>\r\n</script>\r\n<div class="row">\r\n\t<div class="col-lg-12">\r\n\t\t<div class="panel panel-default">\r\n\t\t\t<!-- /.panel-heading -->\r\n\t\t\t<div class="panel-body">\r\n\t\t\t\t<div class="col-xs-9">\r\n\t\t\t\t\t<p>Create callback functions for a given Custom Event by handling and processing its parameters</p>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class="col-xs-3">\r\n\t\t\t\t\t<div class="text-right">\r\n\t\t\t\t\t\t<button ng-click="openCreate()" class="btn btn-success">\r\n\t\t\t\t\t\t\t<i class="fa fa-plus"></i>\r\n\t\t\t\t\t\t\tTrigger\r\n\t\t\t\t\t\t</button>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class="clearfix"></div>\r\n\t\t\t\t<br>\r\n\t\t\t\t<div class="alert alert-warning">\r\n                    <strong>{{ vm.selectedAllPages ? gridTotal : selecteds.length}}/{{gridTotal}}</strong> items selected.\r\n                    <a ng-show="!vm.selectedAllPages" ng-click="toggleSelectAllPages($event)" href="#" class="alert-link">Select all pages</a>\r\n                    <a ng-show="vm.selectedAllPages" ng-click="toggleSelectAllPages($event)" href="#" class="alert-link">Unselect all</a>\r\n                </div>\r\n\t\t\t\t<table class="resp table table-bordered table-hover" ng-table="grid" show-filter="false">\r\n\t\t\t\t\t<tr ng-repeat="item in $data">\r\n\t\t\t\t\t\t<td header="\'bulkSelection.html\'" class="center center-y">\r\n\t\t\t\t\t\t\t<input ng-change="toggleSelection(item)" ng-model="item.isSelected" ng-disabled="vm.selectedAllPages" type="checkbox" />\r\n\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t<td class="break-line" title="\'Name\'" sortable="\'name\'" ng-bind="item.name"></td>\r\n\t\t\t\t\t\t<td class="break-line" title="\'Event Name\'"sortable="\'eventName\'" ng-bind="item.eventName"></td>\r\n\t\t\t\t\t\t<td class="break-line" title="\'Created date\'" sortable="\'createdAt\'" ng-bind="item.createdAt | AppDate"></td>\r\n\t\t\t\t\t\t<td class="break-line center" title="\'Status\'" sortable="\'item.enabled\'">\r\n\t\t\t\t\t\t\t<i class="fa fa-circle status-marker" aria-hidden="true" ng-class="{\'enabled\': item.enabled}" title="{{ item.enabled ? \'enabled\' : \'disabled\'}}"></i>\r\n\t\t\t\t\t\t\t&nbsp;\r\n\t\t\t\t\t\t\t{{ item.enabled ? \'enabled\' : \'disabled\'}}\r\n\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t<td header="\'bulkActions.html\'" class="center center-y">\r\n\t\t\t\t\t\t\t<button title="Show details"type="button" ng-click="showDetails(item)" class="btn btn-sm btn-default">\r\n\t\t\t\t\t\t\t\t<i class="fa fa-pencil">\r\n\t\t\t\t\t\t\t\t</i>\r\n\t\t\t\t\t\t\t</button>\r\n\t\t\t\t\t\t\t<button title="Delete" type="button" ng-click="remove(item)" class="btn btn-sm btn-danger">\r\n\t\t\t\t\t\t\t\t<i class="fa fa-trash">\r\n\t\t\t\t\t\t\t\t</i>\r\n\t\t\t\t\t\t\t</button>\r\n\t\t\t\t\t\t</td>\r\n\t\t\t\t\t</tr>\r\n\t\t\t\t</table>\r\n\t\t\t\t<!-- /.table-responsive -->\r\n\t\t\t</div>\r\n\t\t\t<!-- /.panel-body -->\r\n\t\t</div>\r\n\t\t<!-- /.panel -->\r\n\t</div>\r\n\t<!-- /.col-lg-12 -->\r\n</div>\r\n');
$templateCache.put('partials/triggers.save.html','<div class="modal-body">\r\n\t<div class="row">\r\n\t\t<div class="col-xs-12">\r\n\t\t\t<h3 ng-if="!isEdit">New Trigger</h3>\r\n\t\t\t<h3 ng-if="isEdit">Edit Trigger</h3>\r\n\t\t\t<div ng-if="messages.error" role="alert" class="alert alert-danger">\r\n\t\t\t\t<div ng-repeat="error in messages.error">{{error.msg}}</div>\r\n\t\t\t</div>\r\n\t\t\t<div ng-show="!canSave" role="alert" class="alert alert-danger">\r\n\t\t\t\t<div>\r\n\t\t\t\t\tFix the errors before continuing.\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div ng-show="callbackInvalid" role="alert" class="alert alert-danger">\r\n\t\t\t\t<div ng-bind="validateCallbackError">\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<form ng-submit="submit(form)" name="form" role="form">\r\n\t\t\t\t<div class="form-group">\r\n\t\t\t\t\t<label>Name</label>\r\n\t\t\t\t\t<input required ng-model="trigger.name" class="form-control">\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class="form-group">\r\n\t\t\t\t\t<label>Event name condition</label>\r\n\t\t\t\t\t<input required ng-model="trigger.eventName" class="form-control">\r\n\t\t\t\t\t<p class="help-block">Event name that will trigger the action</p>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class="checkbox">\r\n\t\t\t\t\t<label>\r\n\t\t\t\t\t\t<input type="checkbox" ng-model="trigger.enabled">\r\n\t\t\t\t\t\tEnabled\r\n\t\t\t\t\t</label>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class="form-group">\r\n\t\t\t\t\t<label>Callback function \r\n                    </label>\r\n\t\t\t\t\t<div ui-ace="aceOption" ng-model="trigger.callback"></div>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class="button-group text-right form-group">\r\n\t\t\t\t\t<button type="reset" ng-click="close()" class="btn btn-default">Cancel</button>\r\n\t\t\t\t\t<button ng-disabled="!canSave" type="submit" class="btn btn-success">Save</button>\r\n\t\t\t\t</div>\r\n\t\t\t</form>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n');}]);