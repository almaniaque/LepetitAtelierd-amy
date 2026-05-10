let main =  document.querySelector("main");
let home = document.getElementById("home");
let boutique = document.getElementById("boutique");
let avis = document.getElementById("avis");
let commande = document.getElementById("commande");
let propos = document.getElementById("propos");
let contact = document.getElementById("contact");

let Bibliotheque = [
    {
        image: "./image/lapin/item_Bougie1.jpg",
        titre: "lapin taille S",
        prix: "8€",
        bouton: "ajouter au panier "
    },
        {
        image: "./image/lapin/item_Bougie2.png",
        titre: "lapin taille S",
        prix: "8€",
        bouton: "ajouter au panier "
    },
        {
        image: "./image/lapin/item_Bougie3.png",
        titre: "lapin taille S",
        prix: "8€",
        bouton: "ajouter au panier "
    },
        {
        image: "./image/lapin/item_Bougie4.png",
        titre: "lapin taille S",
        prix: "8€",
        bouton: "ajouter au panier "
    },
        {
        image: "./image/lapin/item_Bougie5.png",
        titre: "lapin taille S",
        prix: "8€",
        bouton: "ajouter au panier "
    },
        {
        image: "./image/lapin/item_Bougie6.png",
        titre: "lapin taille S",
        prix: "8€",
        bouton: "ajouter au panier "
    },
        {
        image: "./image/ourson/s/ourson_1.png",
        titre: "ourson assis taille S",
        prix: "8€",
        bouton: "ajouter au panier "
    },
        {
        image: "./image/ourson/s/ourson_2.png",
        titre: "ourson assis taille S",
        prix: "8€",
        bouton: "ajouter au panier "
    },
        {
        image: "./image/ourson/s/ourson_3.png",
        titre: "ourson assis taille S",
        prix: "8€",
        bouton: "ajouter au panier "
    },

        {
        image: "./image/ourson/s/ourson_4.png",
        titre: "ourson assis taille S",
        prix: "8€",
        bouton: "ajouter au panier "
    },
        {
        image: "./image/ourson/s/ourson_5.png",
        titre: "ourson assis taille S",
        prix: "8€",
        bouton: "ajouter au panier "
    },

        {
        image: "./image/ourson/s/ourson_6.png",
        titre: "ourson assis taille S",
        prix: "8€",
        bouton: "ajouter au panier "
    },

        {
        image: "./image/ourson/s/ourson-debout_1.png",
        titre: "ourson debout taille S",
        prix: "8€",
        bouton: "ajouter au panier "
    },

        {
        image: "./image/ourson/s/ourson-debout_2.png",
        titre: "ourson debout taille S",
        prix: "8€",
        bouton: "ajouter au panier "
    },

        {
        image: "./image/ourson/s/ourson-debout_3.png",
        titre: "ourson debout taille S",
        prix: "8€",
        bouton: "ajouter au panier "
    },
        {
        image: "./image/ourson/s/ourson-debout_4.png",
        titre: "ourson debout taille S",
        prix: "8€",
        bouton: "ajouter au panier "
    },
        {
        image: "./image/ourson/s/ourson-debout_5.png",
        titre: "ourson debout taille S",
        prix: "8€",
        bouton: "ajouter au panier "
    },
        {
        image: "./image/ourson/s/ourson-debout_6.png",
        titre: "ourson debout taille S",
        prix: "8€",
        bouton: "ajouter au panier "
    },
            {
        image: "./image/ourson/s/ourson-noeud1.png",
        titre: "ourson avec petit noeud taille S",
        prix: "8€",
        bouton: "ajouter au panier "
    },        
    {
        image: "./image/ourson/s/ourson-noeud2.png",
        titre: "ourson avec petit noeud taille S",
        prix: "8€",
        bouton: "ajouter au panier "
    },        
    {
        image: "./image/ourson/s/ourson-noeud3.png",
        titre: "ourson avec petit noeud taille S",
        prix: "8€",
        bouton: "ajouter au panier "
    },        
    {
        image: "./image/ourson/s/ourson-noeud4.png",
        titre: "ourson avec petit noeud taille S",
        prix: "8€",
        bouton: "ajouter au panier "
    },        
    {
        image: "./image/ourson/s/ourson-noeud5.png",
        titre: "ourson avec petit noeud taille S",
        prix: "8€",
        bouton: "ajouter au panier "
    },        
    {
        image: "./image/ourson/s/ourson-noeud6.png",
        titre: "ourson avec petit noeud taille S",
        prix: "8€",
        bouton: "ajouter au panier "
    },

]

function creerHome() {
    main.setAttribute("class", "acceuil");
    main.classList.remove("boutique");
    main.classList.remove("avis"); 
    main.classList.remove("Commande"); 
    main.classList.remove("Propos"); 
    main.classList.remove("Contact");

    let accueil = document.createElement("section");
    let message = document.createElement("h1")
    let detail = document.createElement("h3")
    
    accueil.setAttribute("id", "accueil");


    main.appendChild(accueil);
    main.appendChild(message);
    main.appendChild(detail);
}

function creerBibliotheque(element) {
    main.setAttribute("class", "boutique");
    main.classList.remove("acceuil"); 
    main.classList.remove("avis"); 
    main.classList.remove("Commande"); 
    main.classList.remove("Propos"); 
    main.classList.remove("Contact");

    let listeArticle = document.createElement("article");
    document.getElementById("Bib").appendChild(listeArticle);
    listeArticle.setAttribute("class", "Article");
    


    let img = document.createElement("img");
    let listePrix = document.createElement("h3");
    let listeTitre = document.createElement("h3");
    let panier = document.createElement("button");
    let foot = document.createElement("section");
    

    listeArticle.appendChild(img);
    listeArticle.appendChild(listeTitre);
    listeArticle.appendChild(foot);
    
    

    foot.appendChild(listePrix);
    foot.appendChild(panier);
    

    img.setAttribute("src", element.image);
    foot.setAttribute("class", "footer");
    img.setAttribute("class", "image");
    

    listePrix.textContent = (element.prix);
    listeTitre.textContent = (element.titre);
    panier.textContent = (element.bouton);

    
};

function créerAvis() {
    main.setAttribute("class", "avis");
    main.classList.remove("boutique");
    main.classList.remove("acceuil");
    main.classList.remove("Commande");
    main.classList.remove("Propos"); 
    main.classList.remove("Contact");
    
}

function créerCommande(){
    main.setAttribute("class", "Commande");
    main.classList.remove("boutique");
    main.classList.remove("acceuil"); 
    main.classList.remove("avis");  
    main.classList.remove("Propos"); 
    main.classList.remove("Contact");
}

function créerPropos(){
    main.setAttribute("class", "Propos");
    main.classList.remove("boutique");
    main.classList.remove("acceuil"); 
    main.classList.remove("avis");
    main.classList.remove("Commande");
    main.classList.remove("Contact");
}

function créerContact(){
    main.setAttribute("class", "Contact");
    main.classList.remove("boutique");
    main.classList.remove("acceuil"); 
    main.classList.remove("avis");  
    main.classList.remove("Commande"); 
    main.classList.remove("Propos"); 
}

const menuElements = document.querySelectorAll(".menu");

menuElements.forEach(menu => {
    
    menu.addEventListener("click", () => {

        // Reset
        menuElements.forEach(el => el.classList.remove("color"));

        // Active le bon
        menu.classList.add("color");
    

    });
});

const navElement = document.getElementById("navi");

for (let i = 0; i < menuElements.length; i++) {
    menuElements[i].addEventListener("click", (event) => {
        event.preventDefault()
    });
}


home.addEventListener("click", () => {

    // Nettoyage avant affichage
    main.innerHTML = "";

    creerHome()

});

boutique.addEventListener("click", () => {
    
    // Nettoyage avant affichage
    main.innerHTML = "";

    let panelG = document.createElement("section");
    let Bib = document.createElement("section");
    let menuBoutique = document.createElement("nav");
    let ourson = document.createElement("p");
    let bouquet = document.createElement("p");
    let surmesure = document.createElement("p");
    let fondant = document.createElement("p");
    let parfum = document.createElement("p");

    menuBoutique.setAttribute("id", "SelecB")
    Bib.setAttribute("id", "Bib");
    panelG.setAttribute("id", "PanelG");

    menuBoutique.appendChild(ourson);
    menuBoutique.appendChild(bouquet);
    menuBoutique.appendChild(surmesure);
    menuBoutique.appendChild(fondant);
    menuBoutique.appendChild(parfum);
  
    panelG.appendChild(menuBoutique);
    main.appendChild(panelG);
    main.appendChild(Bib);

    Bibliotheque.forEach(creerBibliotheque);
});

avis.addEventListener("click", () => {

    // Nettoyage avant affichage
    main.innerHTML = "";

    créerAvis()
});

commande.addEventListener("click", () => {

    // Nettoyage avant affichage
    main.innerHTML = "";

    créerCommande()
});

propos.addEventListener("click", () => {

    // Nettoyage avant affichage
    main.innerHTML = "";

    créerPropos()
});

contact.addEventListener("click", () => {

    // Nettoyage avant affichage
    main.innerHTML = "";

    créerContact()
});
