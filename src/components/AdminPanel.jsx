import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { defaultData } from '../context/DataProvider';

export default function AdminPanel() {
  const [formData, setFormData] = useState(defaultData);
  const [shareLink, setShareLink] = useState('');
  const [showShareBox, setShowShareBox] = useState(false);

  useEffect(() => {
    const local = localStorage.getItem("romanticData");
    if (local) {
      setFormData(JSON.parse(local));
    }
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e, field, isGallery = false, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      if (isGallery) {
        const newImages = [...formData.images];
        newImages[index].src = base64;
        handleChange('images', newImages);
      } else {
        handleChange(field, base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const addImgField = () => {
    handleChange('images', [...formData.images, { src: '', caption: '', isFavorite: false }]);
  };

  const removeImgField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    handleChange('images', newImages);
  };

  const handleImageChange = (index, field, value) => {
    const newImages = [...formData.images];
    newImages[index][field] = value;
    handleChange('images', newImages);
  };

  const addReasonField = () => {
    handleChange('reasons', [...formData.reasons, { front: '', back: '', special: false }]);
  };

  const removeReasonField = (index) => {
    const newReasons = formData.reasons.filter((_, i) => i !== index);
    handleChange('reasons', newReasons);
  };

  const handleReasonChange = (index, field, value) => {
    const newReasons = [...formData.reasons];
    newReasons[index][field] = value;
    handleChange('reasons', newReasons);
  };

  const saveData = async () => {
    try {
      const uniqueId = Math.random().toString(36).substring(2, 10);

      // Save locally as draft
      localStorage.setItem("romanticData", JSON.stringify(formData));

      // Save to Firebase
      await db.ref("websites/" + uniqueId).set(formData);

      const link = window.location.origin + "/?id=" + uniqueId;

      setShareLink(link);
      setShowShareBox(true);
      alert("Data uploaded to Firebase globally! 🌐 Your true shareable link is generated.");
    } catch (error) {
      console.error("Firebase save failed", error);
      alert("Error saving to Firebase! Check your config or internet connection.");
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      alert("Link copied to clipboard! 📋");
    });
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=I made something special for you! ❤️ %0A${encodeURIComponent(shareLink)}`, '_blank');
  };

  return (
    <div className="admin-body" style={{ margin: 0, padding: '20px', background: 'var(--bg)', fontFamily: 'Poppins, sans-serif' }}>
      <div className="container" style={{ maxWidth: '800px', margin: 'auto', background: 'var(--card-bg)', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(255, 117, 160, 0.1)' }}>
        <h1 style={{ color: 'var(--primary)', textAlign: 'center' }}>Customize Website 💖</h1>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="E.g., Saniya" required />
          </div>
          <div className="form-group">
            <label>Hero Heading</label>
            <input type="text" value={formData.heroHeading} onChange={(e) => handleChange('heroHeading', e.target.value)} placeholder="E.g., Babuiii ek chiz dikhau dekhoge aap?" required />
          </div>

          <h2 style={{ color: 'var(--primary)', textAlign: 'center' }}>🎶 Audio Customization</h2>
          <div className="form-group">
            <label>Romantic Background Music (Upload File or paste URL)</label>
            <input type="file" accept="audio/*" onChange={(e) => handleFileUpload(e, 'romanticAudio')} style={{ marginBottom: '10px' }} />
            <input type="text" value={formData.romanticAudio} onChange={(e) => handleChange('romanticAudio', e.target.value)} placeholder="E.g., romantic.mp3 OR https://example.com/song.mp3" />
          </div>
          <div className="form-group">
            <label>Birthday Song (Upload File or paste URL)</label>
            <input type="file" accept="audio/*" onChange={(e) => handleFileUpload(e, 'birthdayAudio')} style={{ marginBottom: '10px' }} />
            <input type="text" value={formData.birthdayAudio} onChange={(e) => handleChange('birthdayAudio', e.target.value)} placeholder="E.g., birthday.mp3 OR https://example.com/song.mp3" />
          </div>

          <h2 style={{ color: 'var(--primary)', textAlign: 'center' }}>📝 Texts & Letters</h2>
          <div className="form-group">
            <label>Birthday Typing Text</label>
            <input type="text" value={formData.birthdayText} onChange={(e) => handleChange('birthdayText', e.target.value)} placeholder="Happy Birthday ❤️" />
          </div>
          <div className="form-group">
            <label>Love Letter Intro</label>
            <input type="text" value={formData.letterIntro} onChange={(e) => handleChange('letterIntro', e.target.value)} placeholder="Happy Birthday meri jaan ❤️" />
          </div>
          <div className="form-group">
            <label>Love Letter Content (Use empty line for new paragraph)</label>
            <textarea
              value={Array.isArray(formData.letter) ? formData.letter.join('\n\n') : formData.letter}
              onChange={(e) => handleChange('letter', e.target.value.split('\n\n'))}
              rows="8"
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)' }}
            ></textarea>
          </div>
          <div className="form-group">
            <label>Final Vow (Secret Message End)</label>
            <input type="text" value={formData.vowText} onChange={(e) => handleChange('vowText', e.target.value)} placeholder="E.g., No matter what... I'll always choose you ❤️" />
          </div>

          <h2 style={{ color: 'var(--primary)', textAlign: 'center' }}>📸 Image Gallery</h2>
          <div className="form-group">
            <div className="dynamic-list">
              {formData.images.map((img, idx) => (
                <div key={idx} className="list-item img-item" style={{ position: 'relative', background: '#fafafa', padding: '15px', borderRadius: '10px', marginBottom: '10px', border: '1px solid #eee' }}>
                  <button className="remove-btn" onClick={() => removeImgField(idx)}>X</button>
                  <label>Image (Upload or paste URL)</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, null, true, idx)} style={{ marginBottom: '5px', width: '100%' }} />
                  <input type="text" className="img-src" value={img.src} onChange={(e) => handleImageChange(idx, 'src', e.target.value)} placeholder="Or paste image URL" style={{ marginBottom: '10px' }} />
                  {img.src && <img src={img.src} alt="preview" style={{ width: '100px', display: 'block', marginTop: '10px', borderRadius: '8px', marginBottom: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />}
                  <label>Caption</label>
                  <input type="text" className="img-cap" value={img.caption} onChange={(e) => handleImageChange(idx, 'caption', e.target.value)} placeholder="Caption here" />
                  <label style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'normal' }}>
                    <input type="checkbox" checked={img.isFavorite} onChange={(e) => handleImageChange(idx, 'isFavorite', e.target.checked)} /> Make Favorite (Highlight Border)
                  </label>
                </div>
              ))}
            </div>
            <button type="button" className="add-btn" onClick={addImgField}>+ Add Image</button>
          </div>

          <h2 style={{ color: 'var(--primary)', textAlign: 'center' }}>💕 Reasons I Love You</h2>
          <div className="form-group">
            <div className="dynamic-list">
              {formData.reasons.map((reason, idx) => (
                <div key={idx} className="list-item reason-item" style={{ position: 'relative', background: '#fafafa', padding: '15px', borderRadius: '10px', marginBottom: '10px', border: '1px solid #eee' }}>
                  <button className="remove-btn" onClick={() => removeReasonField(idx)}>X</button>
                  <label>Front Text</label>
                  <input type="text" value={reason.front} onChange={(e) => handleReasonChange(idx, 'front', e.target.value)} style={{ marginBottom: '10px' }} />
                  <label>Back Text</label>
                  <textarea value={reason.back} onChange={(e) => handleReasonChange(idx, 'back', e.target.value)} rows="2" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)' }}></textarea>
                  <label style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'normal' }}>
                    <input type="checkbox" checked={reason.special} onChange={(e) => handleReasonChange(idx, 'special', e.target.checked)} /> Special Reason (Pink Grid)
                  </label>
                </div>
              ))}
            </div>
            <button type="button" className="add-btn" onClick={addReasonField}>+ Add Reason</button>
          </div>

          <h2 style={{ color: 'var(--primary)', textAlign: 'center' }}>🚫 'NO' Button Messages</h2>
          <div className="form-group">
            <label>Messages (One per line)</label>
            <textarea
              value={formData.noButtonMessages.join('\n')}
              onChange={(e) => handleChange('noButtonMessages', e.target.value.split('\n'))}
              rows="5"
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)' }}
            ></textarea>
          </div>

          <div className="action-btns" style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
            <button type="button" className="btn-main" onClick={saveData}>Save Changes 💾</button>
            <button type="button" className="btn-main btn-preview" onClick={() => {
              localStorage.setItem("romanticData", JSON.stringify(formData));
              window.open(window.location.origin + "/preview", "_blank");
            }}>Preview Website 👁️</button>
          </div>

          {showShareBox && (
            <div id="share-link-box" style={{ marginTop: '30px', padding: '20px', background: '#fffafc', borderRadius: '10px', border: '2px dashed var(--primary)', textAlign: 'center' }}>
              <h3 style={{ marginTop: 0, color: 'var(--primary)' }}>Your Shareable Link 🎉</h3>
              <p style={{ fontSize: '14px', marginBottom: '15px' }}>Share this link to show your custom website!</p>
              <input type="text" value={shareLink} readOnly style={{ width: '100%', textAlign: 'center', fontWeight: 'bold', marginBottom: '20px', padding: '10px', border: '1px solid var(--border)', borderRadius: '8px' }} />

              <h4 style={{ marginBottom: '15px', color: 'var(--secondary)' }}>Share Your Surprise ❤️</h4>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button type="button" className="btn-main" style={{ padding: '10px 20px', background: '#25D366', minWidth: '140px', border: 'none' }} onClick={shareWhatsApp}>
                  💬 WhatsApp
                </button>
                <button type="button" className="btn-main" style={{ padding: '10px 20px', background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', minWidth: '140px', border: 'none' }} onClick={copyLink}>
                  📸 Instagram / Snap
                </button>
                <button type="button" className="btn-main btn-preview" style={{ padding: '10px 20px', minWidth: '140px' }} onClick={copyLink}>
                  📋 Copy Link
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
