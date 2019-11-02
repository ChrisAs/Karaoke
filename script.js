const karaoke = {}
karaoke.retroApiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWQ5Zjc0YzM5MDk0Y2QwNDNiNzFlNjgzIn0sImlhdCI6MTU3MDczMTIwMywiZXhwIjoxNjAyMjY3MjAzfQ.bU8qiRg2cDazjd1oxXQh7ewGXU4JVEilz0OtiuobeZU';
karaoke.retroBaseUrl = 'https://retroapi.hackeryou.com/api';

karaoke.lyricsBaseUrl = 'https://api.lyrics.ovh/v1'
karaoke.titleSection = $('.songTitle');
karaoke.artistSection = $('.artist');
karaoke.lyricsSection = $('.lyrics');
karaoke.curtains = $('.curtain__checkbox');

//response for grabbing all song information
karaoke.getRandomObjectFromArray = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}
// takes out spaces from artist
karaoke.removeSpaces = function (artist) {
    return artist.trim()
}


karaoke.splitArtistFeatured = function (artist) {
    const array0fArtist = artist.split('feat.')

const formattedSoloArtist = array0fArtist[0].replace(' and ', ' & ')
const formattedSoloArtistNoSpaces = karaoke.removeSpaces(formattedSoloArtist);

return formattedSoloArtistNoSpaces;
}
karaoke.setSong = () => {
    const allRetroDetails = karaoke.getRetroDetails();

    $.when(allRetroDetails).done(function (retroData) {
        const randomYearObject = karaoke.getRandomObjectFromArray(retroData);
        const randomSongObject = karaoke.getRandomObjectFromArray(randomYearObject.songs);
        console.log(randomSongObject);
        const title = randomSongObject.title;
        const artist = karaoke.splitArtistFeatured(randomSongObject.artist);
        karaoke.titleSection.html(title);
        karaoke.artistSection.html(artist);
        karaoke.getLyrics(artist, title);
    })
}
karaoke.getLyrics = (artist, title) => {
    $.ajax({
        url: `${karaoke.lyricsBaseUrl}/${artist}/${title}`,
        method: `GET`,
        dataType: `json`,
    }).then(function(lyrics){
        karaoke.lyricsSection.html(lyrics.lyrics);
    }).fail(function(error){
        console.log(error);
    })
}
karaoke.getRetroDetails = function () {
    const retroPromise = $.ajax({
        url: `${karaoke.retroBaseUrl}/years`,
        method: `GET`,
        dataType: `json`,
        data: {
            apiKey: karaoke.retroApiKey,
        }
    });
    //returns the promise
    return retroPromise;
};
//Calling song at start of page for best user experience
karaoke.init = function () {

let curtainClicks = 0;

    karaoke.setSong();

    karaoke.curtains.on('click', function(){
        if(curtainClicks % 2 === 0 ){
            karaoke.setSong()
        }
         curtainClicks = curtainClicks + 1
    })
}
$(function () {
    karaoke.init()
});