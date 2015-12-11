$(document).ready(function() {
    $('#task-order-form').validate();

    $('#task-order-wizard')
        // Call the wizard plugin
        .wizard()

        // Triggered when clicking the Next/Prev buttons
        .on('actionclicked.fu.wizard', function(e, data) {
            switch (data.step) {
                case 2:
                    if (data.direction == 'next' && !$('#occupation-step [required]').validate()) {
                        e.preventDefault();
                    }
                    break;
                case 3:
                    console.log("3");
                    break;
                default:
                    break;
            }
        })

        // Triggered when clicking the Complete button
        .on('finished.fu.wizard', function(e) {
            $('#task-order-form').submit();
        });
});

