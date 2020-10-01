$(document).ready(function(){

    // Start menu is hidden at load
    var isStartMenuShown = false;

    // Var to hold currently shown folder, empty if none shown
    var currentFolder = "";

    function setupFolders(data) {
        for (let linkGroup of data.linkGroups) {
            $("#rightPane").append(generateMenuFolderHTML(linkGroup.name, linkGroup.icon))
        }
    }

    // Generate the necessary HTML for a folder in the start menu.
    function generateMenuFolderHTML(name, pathToIcon) {
        return `<div class="startFolder">

                <img class="folderImg" src="res/` + pathToIcon + `">

                <p class="folderName">` + name + `</p>

                <p class="folderArrow">&#x25B6;</p>

            </div>`;
    }

    // Generate the necessary HTML for a sub-folder in the start menu.
    function generateSubFolderHTML(name, pathToIcon, url) {
        return `<a class="subFolderLink" href="`+ url +`" target=_blank>
                <div class="startSubFolder">

                  <img class="subFolderImg" src="res/` + pathToIcon + `">

                  <p class="subFolderName">` + name + `</p>
                </div>
            </a>`;
    }

    // Function to populate sub folder with items from given folder
    function populateSubFolder(data, folderIndex, folderName) {
        // Clear the sub folder div ready for new items.
        $("#linkFolder").html("");

        let linkGroup = data.linkGroups
            .find(x => x.name == folderName);

        for (let link of linkGroup.links) {
            // Append items to the pane;
            $("#linkFolder").append(generateSubFolderHTML(link.name, link.icon, link.url));
        }

        setLinkFolderPosition(folderIndex);

        // Show the sub folder.
        $("#linkFolder").css("visibility", "visible");
    }

    // Detect that the start button has been clicked
    $("#startBtn").click(function() {

        if(!isStartMenuShown) {
            //Show menu
            $("#startBtn").addClass("selected");
            $("#startMenu").css("visibility", "visible");
            isStartMenuShown = true;
        } else {
            hideStartMenu();
        }

    });

    function setLinkFolderPosition(folderIndex) {

      // Calculate how far from the bottom of the page the folder should be
      // bottom value of start menu + start menu height - link folder height - folder index * link folder height
      var bottomOffset = 27 + $("#startMenu").height() - $("#linkFolder").height() - (folderIndex * 44);

      // Make sure the folder doesn't go below the screen.
      if(bottomOffset < 0) bottomOffset = 0;

      $("#linkFolder").css("bottom", bottomOffset);

    }

    // Reset appearance of all folders in start menu
    function removeStartFolderStyles() {
        $("#rightPane > div").removeClass("selected");
    }

    // Detect a click anywhere in page
    $(document).click(function(e) {

        var container = $("#startMenuContainer");
        var menuBtn = $("#startBtn");

        // Check that click did not occur within start menu or any of its children.
        if (isStartMenuShown && !container.is(e.target) && container.has(e.target).length === 0 && !menuBtn.is(e.target) && menuBtn.has(e.target).length === 0) {
            hideStartMenu();
        }

    });

    function hideStartMenu() {

        // Change the visual states of the start button and menu to hidden/unselected
        $("#startBtn").removeClass("selected");
        $("#startMenu").css("visibility", "hidden");

        // Hide the sub folder.
        $("#linkFolder").css("visibility", "hidden");
        $("#linkFolder").html("");

        isStartMenuShown = false;

        // No folder is selected anymore since the menu is hidden.
        currentFolder = "";
        removeStartFolderStyles();
    }

    function displayTime() {

        $("#time").html(moment().format("hh:mm A"));
        // Refresh the time every second.
        setTimeout(function() {
            displayTime();
        }, 1000);
    }

    // Run the time update initially
    displayTime();

    function setupBackgroundColor(data) {
        $('body').css('background-color', data.backgroundColor);
    };

    function setupBackgroundImage(data) {
        if (data.backgroundImage == null || data.backgroundImage == '')
            return;

        $('body').css('background-image', `url("${data.backgroundImage}")`);
    }

    new CustomStartStorage().get()
        .then(data => {
            setupFolders(data);
            setupBackgroundColor(data);
            setupBackgroundImage(data);

            // Event for mouse entering a start menu folder
            $(".startFolder").mouseenter(function(event) {

                removeStartFolderStyles();

                // Style the div to look selected.
                $(this).addClass("selected");

                var folderIndex = $(this).index();

                currentFolder = $(this).find('.folderName').html();

                populateSubFolder(data, folderIndex, currentFolder);
            });
        });
});
