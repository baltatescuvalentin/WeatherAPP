function createFooter() {

    const footer = document.createElement('footer');
    const copyright = document.createElement("h3");
    copyright.textContent = `Copyright © baltatescuvalentin ${new Date().getFullYear()} `;

    const githubLink = document.createElement("a");
    githubLink.href = "https://github.com/baltatescuvalentin";

    const githubIcon = document.createElement("i");
    githubIcon.classList.add("fab");
    githubIcon.classList.add("fa-github");
    githubIcon.classList.add('fa-xl');

    githubLink.appendChild(githubIcon);
    footer.appendChild(copyright);
    footer.appendChild(githubLink);

    return footer;
}

export default createFooter;