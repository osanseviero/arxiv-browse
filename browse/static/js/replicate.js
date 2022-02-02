// Labs integration for displaying machine learning demos from replicate.com

(function() {
  const container = document.getElementById("replicate-output")

  // This script is run whenever the Labs toggle input is clicked, regardless of
  // of whether the toggle is enabled or disabled. If content already exists, 
  // we know the toggle was just disabled, so remove content and hide container.
  if (container.innerHTML.trim().length) {
    container.innerHTML = ""
    container.setAttribute("style", "display:none");
    return
  } else {
    container.setAttribute("style", "display:block");
  }

  // Get the arXiv Paper ID from the URL
  // const arxivPaperId = window.location.pathname.split('/').reverse()[0]
  const arxivPaperId = "2103.17249"
  const replicateHost = "https://replicate.com"
  const replicateApiUrl = `${replicateHost}/api/v1/models?arxiv_paper_id=${arxivPaperId}`

  // Find Replicate models for this paper
  fetch(replicateApiUrl)
      .then(response => {
      if (response.ok) {
          return response.json()
      } else {
          console.error("Unable to fetch model data from replicate.com")
          return Promise.reject(response.status)
      }
  })
      .then(data => render(data))
      .catch(error => console.log(error))

  // Render model data as HTML
  function render(data) {
      console.log(data)
      container.innerHTML = `
        ${noModelsFound(data)}
        ${data.models.map(model => renderModel(model))}
      `
  }

  function noModelsFound(data) {
    if (data.models?.length === 0) {
      return `<p>
        No demos found for this paper. You can <a href="https://replicate.com/docs">add one here</a>.
      </p>`
    } else {
      return ``
    }
  }

  function renderModel(model) {
    return `
      <div class="replicate-model">
        <a href="${model.absolute_url}">
          <img src="${model.cover_image}" class="replicate-model-image" />
        </a>
        <div class="replicate-model-details">
          <a href="${model.absolute_url}">
            <h4 class="replicate-model-details-heading">${model.absolute_url.replace("https://", "")}</h4>
          </a>
          <p>${model.description}</p>
        </div>
      </div>
    `
  }

})();