# L’architecture React + Redux se base sur le pattern Flux.

En résumé, il s’agit d’un pattern où la donnée a un cycle de vie unidirectionnel : Etat de l’application > Rendu visuel (terminal, html, etc…) > Action qui altère l’état de l’application > Rendu > Etc.
Exemple: Je n’ai pas chargé l’information « Profil » que je souhaite afficher (ETAT), j’affiche un loader (RENDU), je charge la donnée « Profil » (ACTION), la donnée est chargée (ETAT), J’affiche le « Profil »  (RENDU)

L’élément conceptuel essentiel ici est que l’affichage (le formulaire par exemple) ne modifie JAMAIS l’état de l’application, mais déclenche des actions qui ont un effet de modification.
Dans Redux, ça passe par le dispatch.

Ce pattern d’architecture est fortement inspiré du pattern CQS (Command Query Separation).
En résumé:
* Toute méthode qui change l’état de l’application est appelé une command, et ne renvoie aucun résultat
C’est ce qu’on appelle une action dans Redux
* Toute méthode qui retourne une donnée est appelée query et ne modifie pas l’état (idempotence)
C’est ce qu’on appelle un selector dans Redux

## Vocabulaire et responsabilités:


1. **Composant**

   _Cf la partie dédiée_

2. **Container**

    Assure la connexion entre un composant et le store. Il utilise des sélecteurs et des constructeurs (seule dépendances utilisées dans un container). 
    
    Quand la donnée vient directement du store, il utilise des sélecteurs

    Différents containers peuvent utiliser le même composant pour des usages différents. 

3. **Value Object / Constructor**

    Les pages de l’application partagent un store, mais elles ne partagent souvent pas les mêmes besoins et donc pas les mêmes données qu'elles manipulent.
    Le meilleur exemple est qu’un booking pour la liste des réservations n’est pas la même chose qu’un booking sur la page des réservations de PRO.
    De la même manière, une recommandation pour la recherche n’est pas nécessairement la même chose structure de donnée qu’une recommendation pour le carrousel.

    Ces objets spécifiques (qui ont un but et un contexte identifié) sont construits à partir d’un ou plusieurs sélecteurs.
    On veux remplacer les .shape() par :

        PropTypes.instanceOf(DiscoveryRecommendation)
    
        PropTypes.instanceOf(SearchRecommendation)

    1. Suggestion de construction (à débattre):

        ```
        Class DiscoveryRecommendation() {
             constructor({ recommendationSelector, offererSelector, … })
        }
       ```

    2. Quand utiliser un Value Object ?

        Quand un composant reçoit un structure de donnée (un object {}) que l’on peux nommer car il répond à un cas précis.
        Quand on veux faire apparaitre un élément de vocabulaire qui correspond à un cas métier (donc pas de StructForMyComponent)

4. **Selecteur**
    
    Elément de base qui permet à un container d’accéder à une donnée du store
    Prend le state complet en paramètre et en extrait ce qui est nécéssaire.
    Préserve la structure de la donnée du store ou faire un agrégation pour avoir une donnée primitive (une valeur numérique, une string, etc …)

    Exemples:
    Accéder à un noeud du store : __getFavorites()__
    Accéder à un élément du store : __getFavoritesById()__
    Faire de l’agrégation : __getCountOfFavorite()__

    L’association container + selecteur + value object correspond à l’aspect Query de l’architecture.
    Les sélecteurs peuvent être construit par composition d’autres sélecteurs et sont communs à l’ensemble de l’application.

    Suggestion d’arborescence:
    ```
    src/
    └── selectors/
           ├── getCurrentUser.js
           ├── favorites/
           │    ├── getAllFavorites.js
           │    ├── getFavoriteCount.js
           │    └── getFavoriteByOfferId.js
           └── ...
   ```

5. **Action**

    Une action correspond à un évènement qui se produit dans l’application.
    Il possède une structure du type:
    
    ```
    {
        type: ‘ACTION_NAME_THAT_IS_UNIQUE_AND_SELF_EXPLAINING’,
        payload: {  data_that_are_usefull_to_deal_with_event….  }
    }
   ```

    Une action est transmise via un dispatch. Et l’ensemble des actions sont transmises aux composants via les props.
    Par conséquence, pas de dispatch ni de paramétrage d’action dans les composants.
    Tout est construit dans le container, et c’est ce qui permet au composant d’agir sur l’état de l’application (charger des données, en supprimer, en mettre à jour, etc …)

6. Reduceur

    Un réducteur est l’endroit où l’action est traitée, ce qui a pour effet de modifié l’état.
    Toute la mécanique est super bien expliquée dans la documentation Redux.



## Composant
* Doit avoir une interface PropType claire
* N’est pas responsable d'altérer les données (pas seulement le store)
* Ne connait rien du métier / Ne porte aucune logique métier
* Est soit:
    * Un élément graphique (= porteur de l’identité de l’application) réutilisable et petit (unité de code)
Ces éléments devraient pouvoir être regroupé dans un document de type « design système » qui sert de documentation sur le code
    * Un élément spécifique (= sert à un usage unique) composé d’éléments plus petits

Partant de là, une page est construite à partir de composants petits et réutilisables et qui deviennent de plus en plus complexe et spécifique.
Par conséquent, une page ne sert qu’un seul objectif
Exemple: On aura une page pour la création d’une offre, une pour l’édition, une pour la visualisation, etc … et non pas une seule page qui fait tout

Dans l’esprit, on applique le Single Responsibility Principle (https://fr.wikipedia.org/wiki/Principe_de_responsabilit%C3%A9_unique) et on fait de la composition.




## Bonnes pratiques Composant

* Doit être autonome sur la façon d’afficher = Ne doit pas dépendre d’éléments extérieurs pour s'afficher
Autrement formulé, les éléments HTML qui entourent le composant peuvent: Définir l’espace disponible, la position dans le flux de la page
* (Quand c’est applicable) S'adapte à l’espace disponible, et au format de l'écran
