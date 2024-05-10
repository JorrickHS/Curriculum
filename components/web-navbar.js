const template = document.createElement("template");
template.innerHTML = `
    <div class="container">
      <div class="logo-container">
        <h3 class="logo">Curriculum</h3>
        <button class="SEMButton SEButton">Software Engineering</button>
        <button class="SEMButton ESAButton">Embedded Systems and Automation</button>
        <button class="SEMButton IDSButton">Infrastructure Design and Security</button>
        <button class="SEMButton BIMButton">Business IT and Management</button>
      </div>
    </div>
`;

class WebNavbar extends HTMLElement {
  shadowRoot;

  attachStyling() {
    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "/css/web-navbar.css");
    this.shadowRoot.appendChild(linkElem);
  }

  constructor() {
    super();
    this.firstTime = true;
    this.iteration = 1;
    this.shadowRoot = this.attachShadow({ mode: "open" });
    import("/data/architectuurlaag/se/curriculum.js").then((module) => {
      this.buildTree(module.default, this.shadowRoot, this.firstTime);
    });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.attachStyling();
  }

  buildTree(data, parent) {
    const ul = document.createElement("div");
    ul.classList.add("ssldc-items");
    parent.appendChild(ul);

    data.forEach((item) => {
      const ssldc_li = this.shadowRoot.appendChild(
        document.createElement("div")
      );

      const naamWithoutSSLDC = item.naam.replace("SSLDC", "");
      const sanitizedNaam = naamWithoutSSLDC.trim().replace(/\s+/g, "-");
      ssldc_li.classList.add("ssldc-item");
      ssldc_li.classList.add(sanitizedNaam);

      const ssldc_item_text = this.shadowRoot.appendChild(
        document.createElement("div")
      );
      ssldc_item_text.classList.add("ssldc-item-text");
      ssldc_item_text.textContent = item.naam;
      ssldc_li.appendChild(ssldc_item_text);

      ul.appendChild(ssldc_li);
      if (item.labels) {
        this.buildHboItems(item.labels, ssldc_li);
      }
    });
  }

  buildHboItems(data, parent) {
    const ul = document.createElement("div");
    ul.classList.add("hbo-i-items");
    parent.appendChild(ul);

    data.forEach((item) => {
      const hbo_items = this.shadowRoot.appendChild(
        document.createElement("div")
      );
      hbo_items.classList.add("hbo-i-item");
      ul.appendChild(hbo_items);

      const hbo_tag = this.shadowRoot.appendChild(
        document.createElement("div")
      );

      const naamWithoutHBOI = item.naam.replace("HBO-I", "");
      const sanitizedNaam = naamWithoutHBOI.trim().replace(/\s+/g, "-");

      hbo_tag.classList.add("hbo-i-tag");
      hbo_tag.classList.add(sanitizedNaam);

      hbo_tag.textContent = item.naam;
      hbo_items.appendChild(hbo_tag);

      if (item.vaardigheden) {
        const hboActiviteiten = this.shadowRoot.appendChild(
          document.createElement("div")
        );
        hboActiviteiten.classList.add("hbo-i-activiteiten");
        hbo_tag.addEventListener("click", function (event) {
          console.log(this.textContent);
        });
        hbo_items.appendChild(hboActiviteiten);

        item.vaardigheden.forEach((vaardigheid) => {
          const hboActiviteit = this.shadowRoot.appendChild(
            document.createElement("div")
          );
          const sanitizedNaam = vaardigheid.naam.trim().replace(/\s+/g, "-");

          hboActiviteit.classList.add("hbo-i-activiteit");
          hboActiviteit.classList.add(sanitizedNaam);

          const hboActiviteit_text = this.shadowRoot.appendChild(
            document.createElement("div")
          );

          hboActiviteit_text.textContent = vaardigheid.naam;
          hboActiviteit_text.classList.add("hbo-i-activiteit-text");

          hboActiviteit.addEventListener("click", function (event) {
            console.log(sanitizedNaam);
          });

          hboActiviteit.appendChild(hboActiviteit_text);
          hboActiviteiten.appendChild(hboActiviteit);

          if (vaardigheid.vaardigheden) {
            this.buildHboVaardigheden(
              vaardigheid.vaardigheden,
              hboActiviteit,
              sanitizedNaam
            );
            this.iteration = 3;
          }
        });
      }
    });
  }

  buildHboVaardigheden(data, parent, classname) {
    const hboVaardigheden = document.createElement("div");
    hboVaardigheden.classList.add("hbo-i-vaardigheden");
    hboVaardigheden.classList.add(classname);
    parent.appendChild(hboVaardigheden);

    data.forEach((item) => {
      const hboVaardigheid = this.shadowRoot.appendChild(
        document.createElement("div")
      );
      hboVaardigheid.classList.add("hbo-i-vaardigheid");
      hboVaardigheid.textContent = item.naam;
      hboVaardigheden.appendChild(hboVaardigheid);
      // if (item.labels) {
      //   this.buildHboItems(item.labels, hboVaardigheid);
      // }
    });
  }

  onNavClick() {
    //on nav click
  }

  onSsldcClick() {
    //on ssldc click > show hbo-i-items(tags)
  }

  onHBOTagClick() {
    //on hbo tag click > show hbo-i-activiteiten
  }

  onHBOActivityClick() {
    //on hbo activiteiten click > show hbo-i-vaardigheden
  }
}

customElements.define("web-navbar", WebNavbar);
