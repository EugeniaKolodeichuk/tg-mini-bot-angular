import { Injectable } from '@angular/core';

const domain = 'https://result.school';

export enum ProductType {
  Skill = 'skill',
  Intensive = 'intensive',
  Course = 'course',
}

export interface IProduct {
  id: string;
  text: string;
  title: string;
  link: string;
  image: string;
  time: string;
  type: ProductType;
}

function addDomainToLinkAndImage(product: IProduct) {
  return {
    ...product,
    image: domain + product.image,
    link: domain + product.link,
  };
}

const products: IProduct[] = [
  {
    id: '29',
    title: 'TypeScript',
    link: '/products/typescript',
    image: '/img/icons/products/icon-ts.svg',
    text: 'Basics, types, compiler, classes, generics, utilities, decorators, advanced...',
    time: 'With experience • 2 weeks',
    type: ProductType.Skill,
  },
  {
    id: '30',
    title: 'Git & GitHub',
    link: '/products/git',
    image: '/img/icons/products/icon-git.svg',
    text: 'VCS, version history, branching, remote repository, releases, open source...',
    time: 'With experience • 2 weeks',
    type: ProductType.Skill,
  },
  {
    id: '910',
    title: 'Redux, Redux Toolkit & MobX',
    link: '/products/state-managers',
    image: '/img/icons/products/icon-state-managers.svg',
    text: 'Redux, React Redux, Redux DevTools, Redux Toolkit, RTK Query, MobX...',
    time: 'With experience • 2 weeks',
    type: ProductType.Skill,
  },
  {
    id: '940',
    title: 'React Advanced',
    link: '/products/react',
    image: '/img/icons/products/icon-react.svg',
    text: 'React JS, Hooks, Forms, React Router v6, Context API, Optimization, Architecture, PWA...',
    time: 'With experience • 8 weeks',
    type: ProductType.Skill,
  },
  {
    id: '920',
    title: 'Frontend Developer: First Stage',
    link: '/products/first-stage',
    image: '/img/icons/products/icon-first-stage.svg',
    text: 'JavaScript, Debug, DOM, Webpack, ES6 Import + Export, Git, GitFlow...',
    time: 'From scratch • 3 months',
    type: ProductType.Skill,
  },
  {
    id: '930',
    title: 'Frontend Developer: Second Stage',
    link: '/products/second-stage',
    image: '/img/icons/products/icon-second-stage.svg',
    text: 'React JS, Context API, Redux, Webpack, Docker, TypeScript...',
    time: 'With experience • 6 months',
    type: ProductType.Skill,
  },
  {
    id: '24',
    title: 'Programming Fundamentals',
    link: '/products/base-programming',
    image: '/img/icons/products/icon-base-programming.svg',
    text: 'algorithm basics, browser and internet basics, simple JS commands',
    time: 'From scratch • 2 weeks',
    type: ProductType.Intensive,
  },
  {
    id: '32',
    title: 'First Pet Project in JS',
    link: '/products/demo-week',
    image: '/img/icons/products/icon-test-drive.svg',
    text: 'modal window basics, progress bar logic, checkbox, forms, validation',
    time: 'With experience • 1 week',
    type: ProductType.Intensive,
  },
  {
    id: '33',
    title: 'Advanced JavaScript. Build Your Own Excel',
    link: '/products/advanced-js',
    image: '/img/icons/products/icon-advanced-js.svg',
    text: 'Webpack, Jest, Node.js, State Managers, OOP, ESLint, SASS, Data Layer',
    time: 'With experience • 2 months',
    type: ProductType.Intensive,
  },
  {
    id: '28',
    title: 'JavaScript Fundamentals Course & 50 Exercises',
    link: '/products/javascript',
    image: '/img/icons/products/icon-javascript.svg',
    text: 'JavaScript, arrays, objects, loops, functions, debug, async...',
    time: 'From scratch • 2 weeks',
    type: ProductType.Course,
  },
  {
    id: '23',
    title: 'HTML & CSS — First Step into IT',
    link: '/products/html-css',
    image: '/img/icons/products/icon-html-css.svg',
    text: 'HTML, text, lists, tables, forms, CSS, color, layout...',
    time: 'From scratch • 2 weeks',
    type: ProductType.Course,
  },
  {
    id: '26',
    title: 'JavaScript Marathon: 5 Days — 5 Projects',
    link: '/products/marathon-js',
    image: '/img/icons/products/icon-marathon-five-x-five.svg',
    text: 'image plugin, mini Trello clone, image slider, mini game, animated game',
    time: 'From scratch • 1 week',
    type: ProductType.Course,
  },
  {
    id: '27',
    title: 'From Junior to Middle in One Interview',
    link: '/products/marathon-mfd',
    image: '/img/icons/products/icon-marathon-mfd.svg',
    text: 'Junior vs Middle differences, required stack, soft skills, salary growth',
    time: 'From scratch • 2 days',
    type: ProductType.Course,
  },
  {
    id: '931',
    title: 'Workshop: Perspectives in IT',
    link: '/products/perspectives',
    image: '/img/icons/products/icon-workshop.svg',
    text: '4 steps to an IT career, frontend developer grades and salary, technologies to start...',
    time: 'From scratch • 2 days',
    type: ProductType.Course,
  },
];

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  readonly products: IProduct[] = products.map(addDomainToLinkAndImage)

  getById(id: string) {
    return this.products.find((p) => p.id === id);
  }

  get byGroup() {
    return this.products.reduce((group, product) => {
      if (!group[product.type]) {
        group[product.type] = [];
      }
      group[product.type].push(product);
      return group;
    }, {} as Record<ProductType, IProduct[]>)
  }
}
