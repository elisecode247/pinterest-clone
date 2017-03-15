var loggedIn = ($('#logged-in').text() === 'true');
var username = $('#username').text();
var yellow = '#ffd700';
var grey = '#202b39';
var masonryObject = {
    itemSelector: '.pic',
    columnWidth: 300,
    gutter: 10,
    stagger: 30,
    resize: true,
    fitWidth: true,
    percentPosition: false
};

var createPicElement = function (item) {
    var pic = document.createElement("div");
    var image = document.createElement('img');
    var description = document.createElement('div');
    var btnContainer = document.createElement('div');
    var profile = document.createElement('button');
    var deletePic = document.createElement('button');
    var stars = document.createElement('button');
    var starsCount = document.createElement('span');

    pic.className = 'pic';
    pic.id = item._id;

    image.className = 'pic__img';
    image.setAttribute('src', item.url);

    description.className = 'pic__description';
    description.innerHTML = item.description;

    btnContainer.className = 'pic__inner-container';
    btnContainer.id = item._id;

    profile.className = 'pic__button pic__button--profile';
    profile.style.backgroundImage = `url('${item.ownerPhoto}')`;
    profile.title = item.owner;
    profile.addEventListener('click', function (event) {
        event.preventDefault();
        $.ajax({
            type: 'GET',
            url: `../api/pics/owner/${item.owner}`,
            success: function (result) {
                resetWall();
                createWall(result);
            },
            error: function (result) {
                alert('error');

            }
        });
    })

    deletePic.className = 'pic__button pic__button--delete';
    deletePic.innerHTML = 'x';
    if (loggedIn && username === item.owner) {
        deletePic.addEventListener('click', function (event) {
            event.preventDefault();
            $.ajax({
                type: 'DELETE',
                url: `../api/pics/${item._id}`,
                success: function (result) {
                    pic.parentElement.removeChild(pic);
                    $('.grid').masonry('layout');
                },
                error: function (result) {
                    alert('error');

                }
            });
        })
    } else {
        deletePic.style.visibility = 'hidden';
    }
    stars.className = 'pic__button pic__button--stars';
    if (loggedIn) {
        var loggedInUser = $('#username').text();
        var index = item.stars.findIndex(function (element) {
            return element === loggedInUser;
        })
        if (index > -1) {
            stars.style.color = yellow;
        } else {
            stars.style.color = grey;
        }
    }

    starsCount.className = 'stars__count';
    stars.innerHTML = '&#x2605';
    starsCount.innerText = item.stars.length;
    stars.appendChild(starsCount);

    if (loggedIn) {
        stars.addEventListener('click', function (event) {
            event.preventDefault();
            $.ajax({
                type: 'POST',
                url: `../api/pics/${item._id}/stars`,
                success: function (result) {
                    if (typeof result === 'object') {
                        if (starsCount.innerText < result.stars.length) {
                            stars.style.color = yellow;
                        } else {
                            stars.style.color = grey;
                        }
                        starsCount.innerText = result.stars.length;
                    } else {
                        alert('error');
                    }
                },
                error: function (result) {
                    alert('error');

                }
            });
        })
    } else {
        stars.disabled = true;
        stars.style.cursor = 'not-allowed';
    }

    btnContainer.append(profile, deletePic, stars);
    pic.append(image, description, btnContainer);
    return pic;
}

var onProgress = function (instance, image) {
    var result = image.isLoaded ? 'loaded' : 'broken';
    console.log('image is ' + result + ' for ' + image.img.src);
    if (result === 'broken') {
        image.img.src = '../public/images/brokenimage.png';
    }
}

var getWall = function (url) {
    $.get(url, function (data) {
        createWall(data);
    })
}

var createWall = function (data) {
    $('.grid').css('visibility', 'hidden');

    data.forEach(function (item, index, array) {
        var pic = createPicElement(item);
        $('.grid').append(pic);
    })

    $('.grid').imagesLoaded().progress(onProgress).always(function (instance) {
        $('.grid').masonry(masonryObject);
        $('.grid').css('visibility', 'visible');
    }).fail(function () {
        console.log('all images loaded, at least one is broken');
    })
}

var resetWall = function () {
    $('.grid').empty();
    $('.grid').masonry('destroy');
}

$(document).ready(function () {

    getWall('/api/pics');

    $('.nav__a--all-pics').click(function (event) {
        event.preventDefault();
        resetWall();
        getWall('/api/pics');
    })

    $('.nav__a--my-pics').click(function (event) {
        event.preventDefault();
        resetWall();
        getWall('/api/pics/owner/' + username);
    })

    $('.pic__img').attr('onerror', `src="../public/images/logo.png"`);


})