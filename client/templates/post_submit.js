Template.post_submit.events = {
  'click input[type=submit]': function(e){
    e.preventDefault();
    if(!Meteor.user()) throw 'You must be logged in.';

    var title= $('#title').val();
    var url = $('#url').val();
    var body = $('#body').val();

    var postId = Posts.insert({
        headline: title
      , url: url
      , body: body
      , user_id: Meteor.user()._id
      , submitted: new Date().getTime()
      , votes: 0
      , comments: 0
    });
    var post = Posts.findOne(postId);

    Meteor.call('voteForPost', post);

    Session.set('selected_post', post);
    // Session.set('state', 'view_post');
    Router.navigate('posts/'+postId, {trigger: true});
  }

  ,'click .get-title-link': function(e){
    e.preventDefault();
    var url=$("#url").val();
    $(".get-title-link").addClass("loading");
    if(url){
      $.get(url, function(response){
          if ((suggestedTitle=((/<title>(.*?)<\/title>/m).exec(response.responseText))) != null){
              $("#title").val(suggestedTitle[1]);
          }else{
              alert("Sorry, couldn't find a title...");
          } 
          $(".get-title-link").removeClass("loading");
       });  
    }else{
      alert("Please fill in an URL first!");
    }
  }
};