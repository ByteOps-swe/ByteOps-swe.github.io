function goUp(){
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })

}

document.addEventListener("scroll", function(){
    if(window.scrollY <= document.querySelector('header').offsetHeight ){
        document.getElementById("goUp").classList.remove("goUpVis")
        document.getElementById("goUp").classList.add("goUpNonVis")
    } else {
        document.getElementById("goUp").classList.remove("goUpNonVis")
        document.getElementById("goUp").classList.add("goUpVis")
    }
});

document.addEventListener("FolderTree", function() {
    var toggler = document.getElementsByClassName("Folder");

    for (var i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function() {
            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("Folder-open");
        });

}
});
const candidatura = document.getElementById('Candidatura');
const rtb = document.getElementById('RTB');
const team = document.getElementById('Team');