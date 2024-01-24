let electronicsCompaniesData;

document.addEventListener('DOMContentLoaded', function () {
    fetchData();
});

function fetchData() {
    fetch('./data.json') 
        .then(response => response.json())
        .then(data => {
            electronicsCompaniesData = data;
            initializePage();
        })
        .catch(error => console.error('Error loading data:', error));
}

function initializePage() {
    const searchInput = document.getElementById('searchInput');
    const filterCheckboxesContainer = document.getElementById('filterCheckboxesContainer');
    const filterDropdown = document.getElementById('filterDropdown');
    filterDropdown.addEventListener('change', updateFilterCheckboxes);

     function updateFilterCheckboxes() {
         const selectedFilter = filterDropdown.value;
 
         filterCheckboxesContainer.innerHTML = '';
 
         if (selectedFilter === 'products') {
             const uniqueProducts = getUniqueProducts();
             uniqueProducts.forEach(product => {
                 const checkboxDiv = document.createElement('div');
                 const checkbox = document.createElement('input');
                 checkbox.type = 'checkbox';
                 checkbox.id = `filterCheckbox_${product}`;
                 checkbox.value = product;
                 checkbox.checked = false; 
 
                 const label = document.createElement('label');
                 label.htmlFor = `filterCheckbox_${product}`;
                 label.textContent = product;

                 filterCheckboxesContainer.appendChild(checkboxDiv);
                 checkboxDiv.appendChild(checkbox);
                 checkboxDiv.appendChild(label);
             });
         }
     }
 
     updateFilterCheckboxes();
 
     searchInput.addEventListener('input', search);
     filterCheckboxesContainer.addEventListener('change', search);
     filterDropdown.addEventListener('change', updateFilterCheckboxes);
}

document.addEventListener('DOMContentLoaded', function () {
    const darkModeToggle = document.getElementById('darkModeToggle');

    const resetButton = document.querySelector('button[data-reset-filters]');
    if (resetButton) {
        resetButton.addEventListener('click', resetFilters);
    }

    darkModeToggle.addEventListener('click', toggleDarkMode);

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
    }
});

function search() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    const filterType = document.getElementById('filterDropdown').value;

    // Get the checked checkboxes
    const checkedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const selectedProducts = Array.from(checkedCheckboxes).map(checkbox => checkbox.value);

    if (query === '' && selectedProducts.length === 0) {
        displayCompanyDetails([]);
        return;
    }

    const filteredItems = Object.keys(electronicsCompaniesData).filter(company => {
        const { name, products } = electronicsCompaniesData[company];
        const nameMatch = name.toLowerCase().includes(query);
        const productMatch = products.some(product => product.toLowerCase().includes(query));
        const filterMatch = selectedProducts.length === 0 || products.some(product => selectedProducts.includes(product));
        return (nameMatch || productMatch) && filterMatch;
    });

    displayCompanyDetails(filteredItems);
}


function getSearchTerm(filterType, url, name, stallNo, contactNumber, address, email, products) {
    switch (filterType) {
        case 'name':
            return name.toLowerCase();
        case 'products':
            return products.join(" ").toLowerCase();
        default:
            return '';
    }
}

function displayCompanyDetails(companyList) {
    const companyDetailsContainer = document.getElementById('itemDetails');
    const content = companyList.map(company => {
        const { url, name, stallNo, contactNumber, address, email, products } = electronicsCompaniesData[company];
        return `<div class="exhibitors-data">
                    <h2><a href=${url}>${name}</a></h2>
                    <div><b>Stall Number:</b> ${stallNo} </div>
                    <div><b>Contact Number:</b> ${contactNumber}</div>
                    <div><b>Address:</b> ${address}</div>
                    <div><b>Email:</b><b><a href="mailto:${email}"> ${email}</a></b></div>
                    <div><b>Products:</b> ${products.join(", ")}</div>
                </div><br><hr>`;
    }).join('');
    companyDetailsContainer.innerHTML = content || "<p>No companies found.</p>";
}

function getUniqueProducts() {
    const allProducts = Object.values(electronicsCompaniesData)
        .flatMap(company => [company.products[0], company.products[1]]);
    return [...new Set(allProducts)];
}

function resetFilters() {
    document.getElementById('searchInput').value = '';
    const filterDropdown = document.getElementById('filterDropdown');
    filterDropdown.selectedIndex = 0;
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    search();
}