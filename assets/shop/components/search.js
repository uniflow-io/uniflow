class Search {
  constructor(programFlows, onPush) {
    this.programFlows = programFlows;
    this.onPush = onPush;
    this.element = document.createElement('div');
    this.element.className = 'flow-search';
    this.render();
  }

  render() {
    this.element.innerHTML = '';

    // Create search input
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Search flow...';
    input.className = 'form-control search-input';

    // Create results container
    const results = document.createElement('div');
    results.className = 'search-results d-none';

    // Handle search functionality
    input.addEventListener('input', () => {
      const query = input.value.toLowerCase();
      results.innerHTML = '';

      if (query.length > 0) {
        results.classList.remove('d-none');

        const filteredFlows = this.programFlows.filter(flow =>
          flow.label.toLowerCase().includes(query)
        );

        filteredFlows.forEach(flow => {
          const item = document.createElement('div');
          item.className = 'search-result-item';
          item.textContent = flow.label;
          item.addEventListener('click', () => {
            this.onPush(flow.key);
            input.value = '';
            results.classList.add('d-none');
          });
          results.appendChild(item);
        });
      } else {
        results.classList.add('d-none');
      }
    });

    // Handle click outside to close
    document.addEventListener('click', (e) => {
      if (!this.element.contains(e.target)) {
        results.classList.add('d-none');
      }
    });

    this.element.appendChild(input);
    this.element.appendChild(results);
  }
}


export default Search;

