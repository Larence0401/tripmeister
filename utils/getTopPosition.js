const getTopPosition = (id) => {
        if(!id) return
        const el = document.getElementById(id);
        const top = el.getBoundingClientRect().top;
        // const top = rect.bottom + 32
        console.log(top)
        return top
}

export default getTopPosition