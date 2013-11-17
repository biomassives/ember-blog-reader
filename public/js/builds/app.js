App = Ember.Application.create();

// Cant find another place to put these :(
App.Router.map(function() {
        this.resource('about');
        this.resource('posts', function() {
                this.resource('post', { path: ':post_id' });
        });
});

// handlebar helpers
Ember.Handlebars.helper('format-date', function(date) {
        return moment(date).fromNow();
});

var showdown = new Showdown.converter();

Ember.Handlebars.helper('format-markdown', function(input) {
        return new Handlebars.SafeString(showdown.makeHtml(input));
});;App.PostRoute = Ember.Route.extend({
    model: function(params) {
        //return posts.findBy('id', params.post_id);
        return $.getJSON('http://tomdale.net/api/get_post/?id=' + params.post_id+'&callback=?').then(function(data) {
                data.post.body = data.post.content;
                return data.post;
            });
    }
});;App.PostsRoute = Ember.Route.extend({
    model: function() {
        return $.getJSON('/blog').then(function(data){
            console.dir(data);
            return data.posts.map(function(post) {
                post.body = post.content;
                return post;
            });
        });
    }
});
;App.PostController = Ember.ObjectController.extend({
        isEditing: false,

        actions: {
            edit: function() {
                this.set('isEditing', true);
            },
            doneEditing: function() {
                this.set('isEditing', false);
            }
        }
});