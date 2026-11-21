window.CMC_PROJECTS=[
  {
    slug:'kohn-pedersen-fox',name:'Kohn Pedersen Fox Headquarters',location:'11 West 42nd Street, New York',
    photos:['assets/images/8af21b1a9912835d.webp','assets/images/f28ad7221fb3b0cd.webp','assets/images/e0322469c982f59e.webp'],
    details:[['Architect','Kohn Pedersen Fox'],['Owner','Kohn Pedersen Fox'],['Size','29,500 RSF']],
    description:'KPF’s 29,500 RSF office expansion of the 7th Floor at 11 West 42nd Street. The project contains extensive custom finishes including new office front systems, terrazzo reception desk, a new large conference room, and multiple medium-sized conference rooms.',
    url:'https://www.crossmanagementcorp.com/kohn-pedersen-fox-headquarters'
  },
  {
    slug:'confidential-client-armonk',name:'Confidential Client, Armonk',location:'Armonk, New York',
    photos:['assets/images/0f7b97308f85ef48.webp','assets/images/d43d3ee45cba8db0.webp','assets/images/810af39b5641c207.webp','assets/images/48ef219f808dd9b6.webp'],
    details:[['Architect','HoK Architects'],['Volume','396,400 Gross SF'],['Location','Armonk, New York']],
    description:'Interior and exterior renovation of an executive conference center, including renovation of existing guest rooms, conference rooms, dining facilities, and all new infrastructure. Existing woodwork refinished to match new millwork. Exterior renovations include new windows, roofing, and repainting of the exterior of the building.',
    url:'https://www.crossmanagementcorp.com/confidential-client-armonk'
  },
  {
    slug:'montblanc',name:'Montblanc',location:'Chicago, IL',
    photos:['assets/images/1d52911f989ba5bf.webp','assets/images/8c483e9ad2361e27.webp','assets/images/2f2b9c85e2989d16.webp','assets/images/ec8d05858dc2a054.webp'],
    details:[['Owner','Richemont'],['Location','Chicago, IL']],description:'',
    url:'https://www.crossmanagementcorp.com/montblanc'
  },
  {
    slug:'pretium-partners',name:'Pretium Partners',location:'New York, New York',
    photos:['assets/images/a40bf59f11d9061e.webp','assets/images/c5a8ca2c005841c4.webp','assets/images/c1bbac1ea564e4df.webp'],
    details:[['Architect','Gensler'],['Volume','30,000 Square Feet'],['Location','New York, New York']],
    description:'This project is an open-plan concept with high-end custom ceilings and flooring. Reception and Amenity areas are dominated by millwork, metal and glass, and custom lighting. High-end office fronts complement the office and Conference/Team room areas. The space also includes a Broadcast room for tenant internal and podcast use. The project includes decoustic ceilings, K-13 spray at exposed ceilings, custom millwork booths in the pantry, polished concrete floor, demountable office, front systems sound masking and AV systems, custom light fixtures, and Level 5 wall finish.',
    url:'https://www.crossmanagementcorp.com/pretiumpartners'
  }
];

const CMC_PLACEHOLDER_DESCRIPTION=`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat.`;
for(let number=5;number<=24;number++){
  const padded=String(number).padStart(2,'0');
  window.CMC_PROJECTS.push({slug:`project-${padded}`,name:`Project ${padded}`,location:'Portfolio project',photos:[],photoCount:10,
    details:[],description:CMC_PLACEHOLDER_DESCRIPTION,placeholder:true,url:''});
}
