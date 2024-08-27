 # bindingsjs
 
 A micro front-end communication framework which allows communication between native or custom elements. These custom elements can be written in any front end programming frameworks which allows polyglot programming teams to use communicate between there micro-front ends	


## Demo 
Check the demo website [DEMO](https://bindingjs.netlify.app/) and let us know what you think.



## Goals

 - Define a minimal library which can will add DSL so we can ignore
       writing imperative code. 	
- CMS and like can take advantage of this  declarative DSL language.
- Output of events can be transferred to functions with pipe syntax so custom logic can be written 

## Roadmap 
- A Better documentation
- State management ?
- Publish as NPM package 
- Create Video of explanation





## Code Samples

    <bindings>
	    <binding  source="#pic"  event="onCaptured"  target="#image"  property="src" />
	    
	    <binding  source="#pic"  event="onCaptured"  target="#myTodos"  property="ownerimg" />
	    
	    <binding  source="#pic"  event="onCaptured"  target="#rangeOut"  property="style.backgroundImage"
	    
	    targrtFormat='url("{0}")' />
	    
	    
	    <binding  source="#pic"  event="onCaptured"  target="#gal1"  property="innerHTML"
	    targrtFormat='+<img style="width:100px;height:100px;margin:2px" src="{0}" />' />
	    
	    <binding  source="#myTodos"  event="onTodosChanged"  target="#table"  property="data"  object />
	   
	    <binding  source="#sourceIn"  event="keyup"  target="#targeOut"  property="innerHTML" />
	     
	    <binding  source="#gal1"  event="imageSelected"  target="#myTodos"  property="ownerimg" />
	    
	    <binding  source="#gal1"  event="imageSelected"  target="#rangeOut"  property="style.backgroundImage"
	    targrtFormat='url("{0}")' />

	    
	    <binding  source="#range"  event="input"  target="#rangeOut"  pipe="console.log" />
	    	    
	    <binding  source="#range"  event="input"  target="#rangeOut"  property="innerText"  targrtFormat="{0}%" />
	    
	    <binding  source="#range"  event="input"  target="#rangeOut"  property="style.width"  targrtFormat="{0}%" />
	    
	    <binding  source="#range"  event="input"  target="#rangeOut"  property="style.height"  targrtFormat="{0}vh" />
	    
	    <binding  source="#selector1"  event="change"  target="#selector2"  property="selecteditems"  object />
    </bindings>

 
## thanks 

Thanks Mamba UI 
https://mambaui.com/components/sidebar