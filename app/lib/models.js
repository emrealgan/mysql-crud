// Patient class
export class Patient {
    constructor(ad, soyad, dogumTarihi, cinsiyet, telefon, adres) {
        this.ad = ad;
        this.soyad = soyad;
        this.dogumTarihi = dogumTarihi;
        this.cinsiyet = cinsiyet;
        this.telefon = telefon;
        this.adres = adres;
    }
}

// Doctor class
export class Doctor {
    constructor(ad, soyad, uzmanlikID, hastaneID) {
        this.ad = ad;
        this.soyad = soyad;
        this.uzmanlikID = uzmanlikID;
        this.hastaneID = hastaneID;
    }
}

export class Administrator {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}

export class Appointment {
    constructor(hastaID, doktorID, randevuTarihi, randevuSaati) {
        this.hastaID = hastaID;
        this.doktorID = doktorID;
        this.randevuTarihi = randevuTarihi;
        this.randevuSaati = randevuSaati;
    }
}

export class MedicalReport {
    constructor(hastaID, doktorID, raporTarihi, raporUrl, raporIcerigi) {
        this.hastaID = hastaID;
        this.doktorID = doktorID;
        this.raporTarihi = raporTarihi;
        this.raporIcerigi = raporIcerigi;
        this.raporUrl = raporUrl;
    }
}
export class Hospital {
    constructor(hastaneAdi) {
        this.hastaneAdi = hastaneAdi;
    }
}export class Specialty {
    constructor(uzmanlikAlani) {
        this.uzmanlikAlani = uzmanlikAlani;
    }
}
