jQuery(function($) {

    var contact_form = $('#contact-form');

    /* message used on contact submit success */
    var success_msg = 'Your enquiry has been successfully submitted';

    /* message used for error of the contact form */
    var general_error_msg = 'Some of the information submitted is incorrect';

    /* on contact form submit */
    $(contact_form).submit(function(event) {

        event.preventDefault();

        var error = false;

        /* check message is not empty */
        if($('#contact_message').val() == ""){
            var error_msg = "Please enter a message";
            error = true;
        }

        /* check email is not empty */
        if($('#contact_email').val() == ""){
            var error_msg = "Please enter your email address";
            error = true;
        }

        /* check name is not empty */
        if($('#contact_name').val() == ""){
            var error_msg = "Please enter your name";
            error = true;
        }

        /* if inputs are not empty */
        if(error === false){

            $.ajax({
                type: 'POST',
                data: $(contact_form).serialize(),
                url: 'includes/form_process.php',
                dataType: 'json',
                success:function(returnData){

                    /* -- return from contact submit */
                    var returnJSONobj = returnData;
                    var status = (returnJSONobj.contact_status);

                    if(status == 0)
                    {
                        /* successfully submitted */
                        $('#error-message').slideUp();
                        $('.contact-input,.contact-text').val('');
                        $('#success-message').slideDown();
                        $('#success-message p').text(success_msg);

                    } else if(status == 1) {
                        /* not submitted - error */
                        $('#error-message').slideDown();
                        $('#error-message p').text(general_error_msg);
                    }

                }

            })

        /* an input is empty */
        } else {
            $('#error-message').slideDown();
            $('#error-message p').text(error_msg);
        }

    });

});