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

const candidatura = document.getElementById('Candidatura');
const rtb = document.getElementById('RTB');
const team = document.getElementById('Team');