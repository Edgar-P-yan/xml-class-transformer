export function errUnknownClass(classConstructor: any): Error {
  return new Error(
    `Class "${classConstructor}" not found. Make sure there is a @XmlEntity({...}) decorator on it, or @XmlProperty({...}) decorator on its properties.`,
  );
}

export function serializeUnionForLog(union: any[]): string {
  return (
    '[' +
    union
      .map((t) =>
        t === null ? 'null' : t === undefined ? 'undefined' : t.name,
      )
      .join(', ') +
    ']'
  );
}
