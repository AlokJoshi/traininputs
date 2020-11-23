class Segments{
    constructor(){
      this.segments=[]
    }
  add(segment_number,lineSegment,segment){
    this.segments.push(
      {
        segment_number,
        lineSegment,
        segment
      }
    )
  }
  draw(ctx,pathEditMode){
    this.segments.forEach(s=>s.segment.draw(ctx))
  }
  drawBackground(ctx){
    this.segments.forEach(s=>s.segment.drawBackground(ctx))  
  }
  get lineSegments(){
    return this.segments.filter(s=>s.lineSegment).map(s=>s.segment)
  }
  get quadraticSegments(){
    return this.segments.filter(s=>!s.lineSegment).map(s=>s.segment)
  }
  get length(){
    return this.segments.length
  }
}