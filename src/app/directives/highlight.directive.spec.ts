import { HighlightDirective } from './highlight.directive';


describe('HighlightDirective', () => {
  it('should create an instance', () => {
   let a : any;
   let b : any;
    const directive = new HighlightDirective(a,b);
    expect(directive).toBeTruthy();
  });
});
